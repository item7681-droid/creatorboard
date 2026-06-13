import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { videoCache } from "@/lib/db/schema";
import { hasEnv } from "@/lib/env";
import { getCuratedVideos } from "./curated";
import type { VideoCandidate } from "./types";

const CACHE_DAYS = 7;

export async function getVideoCandidates(
  keywords: string[],
  limit = 15,
  categoryId?: string
): Promise<VideoCandidate[]> {
  const keyword = keywords[0] ?? "초보 유튜브";
  const cacheKey = categoryId ? `${keyword}::category:${categoryId}` : keyword;

  try {
    const db = getDb();
    const now = new Date();
    const cached = await db
      .select()
      .from(videoCache)
      .where(and(eq(videoCache.keyword, cacheKey), gt(videoCache.expiresAt, now)))
      .orderBy(desc(videoCache.viewCount))
      .limit(limit);

    if (cached.length >= limit) {
      return cached.map(mapCacheRow);
    }

    const fetched = hasEnv("YOUTUBE_API_KEY")
      ? await fetchFromYouTube(keyword, 50, categoryId)
      : getCuratedVideos(keyword, 50);

    const expiresAt = new Date(Date.now() + CACHE_DAYS * 24 * 60 * 60 * 1000);
    await db
      .insert(videoCache)
      .values(
        fetched.map((video) => ({
          keyword: cacheKey,
          youtubeVideoId: video.youtubeVideoId,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          thumbnailText: video.thumbnailText,
          channelTitle: video.channelTitle,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          commentCount: video.commentCount,
          publishedAt: new Date(video.publishedAt),
          durationSeconds: video.durationSeconds,
          rawJson: video,
          expiresAt
        }))
      )
      .onConflictDoNothing();

    const rows = await db
      .select()
      .from(videoCache)
      .where(and(eq(videoCache.keyword, cacheKey), gt(videoCache.expiresAt, now)))
      .orderBy(desc(videoCache.viewCount))
      .limit(limit);

    return rows.map(mapCacheRow);
  } catch {
    return getCuratedVideos(keyword, limit);
  }
}

export async function getCachedVideosByIds(ids: string[]) {
  const db = getDb();
  const rows = await db.select().from(videoCache).where(inArray(videoCache.id, ids));
  return rows.map(mapCacheRow);
}

async function fetchFromYouTube(keyword: string, maxResults: number, categoryId?: string): Promise<VideoCandidate[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return getCuratedVideos(keyword, maxResults);

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("key", apiKey);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", keyword);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("order", "viewCount");
  searchUrl.searchParams.set("maxResults", String(Math.min(maxResults, 50)));
  if (categoryId) {
    searchUrl.searchParams.set("videoCategoryId", categoryId);
  }

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return getCuratedVideos(keyword, maxResults);
  const searchJson = await searchRes.json();
  const ids = (searchJson.items ?? []).map((item: { id: { videoId: string } }) => item.id.videoId).filter(Boolean);

  if (ids.length === 0) return getCuratedVideos(keyword, maxResults);

  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("key", apiKey);
  videosUrl.searchParams.set("part", "snippet,statistics,contentDetails");
  videosUrl.searchParams.set("id", ids.join(","));

  const videosRes = await fetch(videosUrl);
  if (!videosRes.ok) return getCuratedVideos(keyword, maxResults);
  const videosJson = await videosRes.json();

  return (videosJson.items ?? []).map(
    (item: {
      id: string;
      snippet: {
        title: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
      };
      statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
      contentDetails?: { duration?: string };
    }) => ({
      id: item.id,
      keyword,
      youtubeVideoId: item.id,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ??
        item.snippet.thumbnails?.medium?.url ??
        item.snippet.thumbnails?.default?.url ??
        "",
      thumbnailText: extractThumbnailText(item.snippet.title),
      channelTitle: item.snippet.channelTitle,
      viewCount: Number(item.statistics?.viewCount ?? 0),
      likeCount: Number(item.statistics?.likeCount ?? 0),
      commentCount: Number(item.statistics?.commentCount ?? 0),
      publishedAt: item.snippet.publishedAt,
      durationSeconds: parseDuration(item.contentDetails?.duration ?? "PT0S")
    })
  );
}

function mapCacheRow(row: typeof videoCache.$inferSelect): VideoCandidate {
  return {
    id: row.id,
    keyword: row.keyword,
    youtubeVideoId: row.youtubeVideoId,
    title: row.title,
    thumbnailUrl: row.thumbnailUrl,
    thumbnailText: row.thumbnailText ?? extractThumbnailText(row.title),
    channelTitle: row.channelTitle,
    viewCount: row.viewCount,
    likeCount: row.likeCount,
    commentCount: row.commentCount,
    publishedAt: row.publishedAt?.toISOString() ?? new Date().toISOString(),
    durationSeconds: row.durationSeconds
  };
}

function extractThumbnailText(title: string) {
  const cleaned = title.replace(/[^\p{L}\p{N}\s]/gu, "").trim();
  return cleaned.split(/\s+/).slice(0, 4).join(" ") || "첫 영상";
}

function parseDuration(iso: string) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
}
