import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { generationSessions, selectedVideos } from "@/lib/db/schema";
import { hasEnv } from "@/lib/env";
import { getOrCreateGuestSessionId } from "@/lib/session/guest";
import { generateProfitTemplate } from "@/lib/templates/profit";
import { assertCanGenerate, incrementGenerationUsage } from "@/lib/usage/limits";
import { getCuratedVideos } from "@/lib/youtube/curated";
import { getCachedVideosByIds } from "@/lib/youtube/service";
import type { VideoCandidate } from "@/lib/youtube/types";

const schema = z.object({
  generationSessionId: z.string().min(1),
  videoIds: z.array(z.string().min(1)).length(3),
  keyword: z.string().optional()
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const sessionId = await getOrCreateGuestSessionId();

  if (!hasEnv("DATABASE_URL")) {
    const curated = getCuratedVideos(body.keyword ?? "초보 유튜브", 15);
    const videos = body.videoIds
      .map((id) => curated.find((video) => video.id === id))
      .filter((video): video is VideoCandidate => Boolean(video));

    if (videos.length !== 3) {
      return NextResponse.json({ message: "선택한 영상 3개를 찾을 수 없습니다." }, { status: 400 });
    }

    return NextResponse.json({
      selectedVideos: videos,
      generated: generateProfitTemplate(videos),
      demoMode: true
    });
  }

  await assertCanGenerate({ sessionId });

  const videos = await getCachedVideosByIds(body.videoIds);
  if (videos.length !== 3) {
    return NextResponse.json({ message: "선택한 영상 3개를 찾을 수 없습니다." }, { status: 400 });
  }

  const db = getDb();
  await db.delete(selectedVideos).where(eq(selectedVideos.generationSessionId, body.generationSessionId));
  await db.insert(selectedVideos).values(
    body.videoIds.map((videoCacheId, index) => ({
      generationSessionId: body.generationSessionId,
      videoCacheId,
      rank: index + 1
    }))
  );
  await db
    .update(generationSessions)
    .set({ status: "day-2", updatedAt: new Date() })
    .where(eq(generationSessions.id, body.generationSessionId));

  const generated = generateProfitTemplate(videos);
  await incrementGenerationUsage({ sessionId });

  return NextResponse.json({
    selectedVideos: videos,
    generated
  });
}
