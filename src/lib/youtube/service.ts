import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { videoCache } from "@/lib/db/schema";
import { getCuratedVideos } from "./curated";
import type { VideoCandidate } from "./types";

const CACHE_DAYS = 7;
const DEFAULT_VIDEO_FORMAT = "midform";
const MIDFORM_MIN_SECONDS = 60;
const EXCLUDED_VIDEO_KEYWORDS = [
  "연예인",
  "셀럽",
  "아이돌",
  "배우",
  "가수",
  "공식",
  "official",
  "방송",
  "예능",
  "드라마",
  "뉴스",
  "하이라이트",
  "티저",
  "trailer",
  "teaser",
  "mv",
  "뮤비",
  "music video",
  "한예슬",
  "정선호",
  "신세경",
  "sjkuksee",
  "stray kids",
  "skz",
  "손흥민",
  "nct",
  "엔시티"
];
const EXCLUDED_CHANNEL_KEYWORDS = [
  "official",
  "공식",
  "kbs",
  "mbc",
  "sbs",
  "jtbc",
  "tvn",
  "mnet",
  "딩고",
  "dingo",
  "뉴스",
  "news",
  "한예슬",
  "정선호",
  "신세경",
  "sjkuksee",
  "stray kids",
  "skz",
  "손흥민",
  "nct",
  "엔시티"
];

export async function getVideoCandidates(
  keywords: string[],
  limit = 15,
  categoryId?: string,
  apiKeyOverride?: string,
  options: { forceRefresh?: boolean } = {}
): Promise<VideoCandidate[]> {
  const keyword = keywords[0] ?? "초보 유튜브";
  const apiKey = normalizeApiKey(apiKeyOverride) ?? normalizeApiKey(process.env.YOUTUBE_API_KEY);
  const source = apiKey ? "youtube" : "curated";
  const baseCacheKey = categoryId ? `${keyword}::category:${categoryId}` : keyword;
  const cacheKey = `${baseCacheKey}::source:${source}::format:${DEFAULT_VIDEO_FORMAT}`;

  try {
    const db = getDb();
    const now = new Date();
    if (options.forceRefresh) {
      await db.delete(videoCache).where(eq(videoCache.keyword, cacheKey));
    }
    const cached = await db
      .select()
      .from(videoCache)
      .where(and(eq(videoCache.keyword, cacheKey), gt(videoCache.expiresAt, now)))
      .orderBy(desc(videoCache.viewCount))
      .limit(limit);

    if (cached.length > 0) {
      return cached.map(mapCacheRow);
    }

    if (!apiKey) return [];
    const fetched = await fetchYouTubeCandidates(keywords, 50, categoryId, apiKey);

    if (fetched.length > 0) {
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
    }

    const rows = await db
      .select()
      .from(videoCache)
      .where(and(eq(videoCache.keyword, cacheKey), gt(videoCache.expiresAt, now)))
      .orderBy(desc(videoCache.viewCount))
      .limit(limit);

    return rows.map(mapCacheRow);
  } catch {
    if (apiKey) {
      try {
        return await fetchYouTubeCandidates(keywords, limit, categoryId, apiKey);
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function getCachedVideosByIds(ids: string[]) {
  const db = getDb();
  const rows = await db.select().from(videoCache).where(inArray(videoCache.id, ids));
  return rows.map(mapCacheRow);
}

async function fetchYouTubeCandidates(
  keywords: string[],
  maxResults: number,
  categoryId: string | undefined,
  apiKey: string
) {
  const uniqueKeywords = buildSearchKeywords(keywords).slice(0, 4);
  const searchKeywords = uniqueKeywords.length > 0 ? uniqueKeywords : ["초보 유튜브"];
  const videos = new Map<string, VideoCandidate>();

  for (const searchKeyword of searchKeywords) {
    const categorized = await fetchFromYouTube(searchKeyword, maxResults, categoryId, apiKey);
    for (const video of categorized) {
      videos.set(video.youtubeVideoId, video);
      if (videos.size >= maxResults) return Array.from(videos.values());
    }

    if (categoryId) {
      const uncategorized = await fetchFromYouTube(searchKeyword, maxResults, undefined, apiKey);
      for (const video of uncategorized) {
        videos.set(video.youtubeVideoId, video);
        if (videos.size >= maxResults) return Array.from(videos.values());
      }
    }
  }

  return Array.from(videos.values());
}

function buildSearchKeywords(keywords: string[]) {
  const NOISE = [
    /으로 월 \d+만원 벌기/g, /월 \d+만원 벌기/g, /초보가 시작하는 방법/g,
    /콘텐츠 아이디어/g, /얼굴 없이 하는/g, /첫 영상 만들기/g,
    /조회수 폭발한/g, /성공 채널 공통점/g, /월 수익 공개/g,
  ];

  const candidates = keywords.flatMap((keyword) => {
    const value = keyword.trim();
    if (!value) return [];

    let cleaned = value;
    for (const pat of NOISE) cleaned = cleaned.replace(pat, "");
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    const slashParts = cleaned.split("/").map((p) => p.trim()).filter(Boolean);
    const short = cleaned.split(/\s+/).slice(0, 3).join(" ");

    return [cleaned, short, ...slashParts].filter((s) => s.length >= 2);
  });

  return Array.from(new Set(candidates.filter(Boolean)));
}

async function fetchFromYouTube(
  keyword: string,
  maxResults: number,
  categoryId: string | undefined,
  apiKey: string
): Promise<VideoCandidate[]> {
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("key", apiKey);
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("q", keyword);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("order", "viewCount");
  searchUrl.searchParams.set("videoDuration", "any");
  searchUrl.searchParams.set("maxResults", String(Math.min(maxResults, 50)));
  if (categoryId) {
    searchUrl.searchParams.set("videoCategoryId", categoryId);
  }

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    const errJson = await searchRes.json().catch(() => ({}));
    const reason = errJson?.error?.message ?? searchRes.statusText;
    throw new Error(`YouTube API 오류 (${searchRes.status}): ${reason}`);
  }
  const searchJson = await searchRes.json();
  const ids = (searchJson.items ?? []).map((item: { id: { videoId: string } }) => item.id.videoId).filter(Boolean);

  if (ids.length === 0) return [];

  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("key", apiKey);
  videosUrl.searchParams.set("part", "snippet,statistics,contentDetails");
  videosUrl.searchParams.set("id", ids.join(","));

  const videosRes = await fetch(videosUrl);
  if (!videosRes.ok) {
    throw new Error(`YouTube API 영상 조회 오류 (${videosRes.status})`);
  }
  const videosJson = await videosRes.json();

  return (videosJson.items ?? [])
    .map((item: {
      id: string;
      snippet: {
        title: string;
        channelTitle: string;
        publishedAt: string;
        thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
      };
      statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
      contentDetails?: { duration?: string };
    }) => {
      const durationSeconds = parseDuration(item.contentDetails?.duration ?? "PT0S");
      return {
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
        durationSeconds
      };
    })
    .filter((video: VideoCandidate) => video.durationSeconds >= MIDFORM_MIN_SECONDS)
    .filter(isCreatorReferenceVideo);
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

function normalizeApiKey(value?: string | null) {
  const key = value?.trim();
  if (!key || key.startsWith("YOUR_")) return null;
  return key;
}

function isCreatorReferenceVideo(video: VideoCandidate) {
  const title = video.title.toLowerCase();
  const channel = video.channelTitle.toLowerCase();

  return (
    !EXCLUDED_VIDEO_KEYWORDS.some((keyword) => title.includes(keyword.toLowerCase())) &&
    !EXCLUDED_CHANNEL_KEYWORDS.some((keyword) => channel.includes(keyword.toLowerCase()))
  );
}
