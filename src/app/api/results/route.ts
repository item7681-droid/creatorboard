import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { authOptions, getUserIdByEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { diagnoses, generationSessions, savedResults } from "@/lib/db/schema";
import { getCategoryLabelFromEnglish } from "@/lib/youtube/categories";
import { getCategoriesByTopics } from "@/lib/mbti/table";

const schema = z.object({
  generationSessionId: z.string().uuid(),
  searchSummary: z.string().min(1),
  finalTitle: z.string().min(1),
  finalThumbnailText: z.string().min(1),
  titleCandidates: z.array(z.string()).min(1),
  thumbnailCandidates: z.array(z.string()).min(1),
  videoOutline: z.array(z.string()).min(1),
  sevenDayPlan: z.array(z.object({ day: z.number(), title: z.string(), task: z.string() })),
  memo: z.string().optional(),
  completedDay: z.number().int().min(0).max(7).optional()
});

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const db = getDb();
  const rows = await db
    .select({
      id: savedResults.id,
      searchSummary: savedResults.searchSummary,
      finalTitle: savedResults.finalTitle,
      finalThumbnailText: savedResults.finalThumbnailText,
      createdAt: savedResults.createdAt,
      representativeCategory: diagnoses.knownField,
      interestTopic: diagnoses.interestTopic,
      recommendedKeywords: generationSessions.recommendedKeywords
    })
    .from(savedResults)
    .innerJoin(generationSessions, eq(savedResults.generationSessionId, generationSessions.id))
    .innerJoin(diagnoses, eq(generationSessions.diagnosisId, diagnoses.id))
    .where(and(eq(savedResults.userId, userId), eq(savedResults.isDeleted, false)))
    .orderBy(desc(savedResults.createdAt));
  return NextResponse.json({
    results: rows.map((row) => ({
      ...row,
      representativeCategory: getCategoryLabelFromEnglish(row.representativeCategory),
      recommendedCategories: getCategoriesByTopics(row.representativeCategory, row.interestTopic)
    }))
  });
}

export async function POST(request: Request) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const body = schema.parse(await request.json());
  const { completedDay, ...resultBody } = body;
  const db = getDb();
  const [saved] = await db
    .insert(savedResults)
    .values({
      userId,
      ...resultBody
    })
    .onConflictDoUpdate({
      target: savedResults.generationSessionId,
      set: {
        finalTitle: resultBody.finalTitle,
        finalThumbnailText: resultBody.finalThumbnailText,
        titleCandidates: resultBody.titleCandidates,
        thumbnailCandidates: resultBody.thumbnailCandidates,
        videoOutline: resultBody.videoOutline,
        sevenDayPlan: resultBody.sevenDayPlan,
        memo: resultBody.memo,
        isDeleted: false,
        updatedAt: new Date()
      }
    })
    .returning();

  await db
    .update(generationSessions)
    .set({ userId, status: `day-${completedDay ?? 1}`, updatedAt: new Date() })
    .where(eq(generationSessions.id, resultBody.generationSessionId));

  const [generationSession] = await db
    .select({ diagnosisId: generationSessions.diagnosisId })
    .from(generationSessions)
    .where(eq(generationSessions.id, resultBody.generationSessionId))
    .limit(1);

  if (generationSession) {
    await db
      .update(diagnoses)
      .set({ userId })
      .where(eq(diagnoses.id, generationSession.diagnosisId));
  }

  return NextResponse.json({ result: saved });
}

async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (!session?.user?.email) return null;
  return getUserIdByEmail(session.user.email);
}
