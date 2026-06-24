import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { diagnoses, generationSessions } from "@/lib/db/schema";
import { hasEnv } from "@/lib/env";
import { getOrCreateGuestSessionId } from "@/lib/session/guest";
import { buildKeywordsFromProfile } from "@/lib/youtube/keywords";

const schema = z.object({
  reason: z.string().min(1),
  expectedResult: z.string().min(1),
  knownField: z.string().min(1),
  categoryId: z.string().optional(),
  interestTopic: z.string().min(1),
  facePreference: z.string().min(1),
  availableTime: z.string().min(1),
  avoidTopic: z.string().optional(),
  shootingBurden: z.coerce.number().min(1).max(5),
  mbtiType: z.string().optional(),
  categories: z.string().optional()
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const diagnosisBody = {
    reason: body.reason,
    expectedResult: body.expectedResult,
    knownField: body.knownField,
    interestTopic: body.interestTopic,
    facePreference: body.facePreference,
    availableTime: body.availableTime,
    avoidTopic: body.avoidTopic,
    shootingBurden: body.shootingBurden
  };
  const sessionId = await getOrCreateGuestSessionId();
  const categoryPool = body.categories ? body.categories.split(/,\s*/) : [];
  const keywords = buildKeywordsFromProfile(body.mbtiType ?? "ISFJ", categoryPool, body.interestTopic);

  if (!hasEnv("DATABASE_URL")) {
    const now = Date.now();
    return NextResponse.json({
      diagnosisId: `demo-diagnosis-${now}`,
      generationSessionId: `demo-session-${now}`,
      recommendedKeywords: keywords,
      demoMode: true
    });
  }

  const db = getDb();
  const [diagnosis] = await db
    .insert(diagnoses)
    .values({
      ...diagnosisBody,
      sessionId,
      recommendedKeywords: keywords
    })
    .returning();

  const [generationSession] = await db
    .insert(generationSessions)
    .values({
      diagnosisId: diagnosis.id,
      sessionId,
      recommendedKeywords: keywords
    })
    .returning();

  return NextResponse.json({
    diagnosisId: diagnosis.id,
    generationSessionId: generationSession.id,
    recommendedKeywords: keywords
  });
}
