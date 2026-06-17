import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq, or } from "drizzle-orm";
import { authOptions, getUserIdByEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { diagnoses, generationSessions } from "@/lib/db/schema";
import { hasEnv } from "@/lib/env";
import { getGuestSessionId } from "@/lib/session/guest";

export async function GET() {
  if (!hasEnv("DATABASE_URL")) {
    return NextResponse.json({ diagnosis: null }, { status: 404 });
  }

  const userId = await getAuthedUserId();
  const guestSessionId = await getGuestSessionId();

  if (!userId && !guestSessionId) {
    return NextResponse.json({ diagnosis: null }, { status: 404 });
  }

  const db = getDb();
  const rows = await db
    .select({
      diagnosisId: diagnoses.id,
      generationSessionId: generationSessions.id,
      reason: diagnoses.reason,
      expectedResult: diagnoses.expectedResult,
      knownField: diagnoses.knownField,
      interestTopic: diagnoses.interestTopic,
      facePreference: diagnoses.facePreference,
      availableTime: diagnoses.availableTime,
      avoidTopic: diagnoses.avoidTopic,
      shootingBurden: diagnoses.shootingBurden,
      recommendedKeywords: generationSessions.recommendedKeywords,
      status: generationSessions.status
    })
    .from(generationSessions)
    .innerJoin(diagnoses, eq(generationSessions.diagnosisId, diagnoses.id))
    .where(
      userId && guestSessionId
        ? or(eq(generationSessions.userId, userId), eq(generationSessions.sessionId, guestSessionId))
        : userId
          ? eq(generationSessions.userId, userId)
          : eq(generationSessions.sessionId, guestSessionId!)
    )
    .orderBy(desc(generationSessions.updatedAt), desc(generationSessions.createdAt))
    .limit(1);

  const diagnosis = rows[0];
  if (!diagnosis) {
    return NextResponse.json({ diagnosis: null }, { status: 404 });
  }

  return NextResponse.json({ diagnosis });
}

async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (!session?.user?.email) return null;
  return getUserIdByEmail(session.user.email);
}
