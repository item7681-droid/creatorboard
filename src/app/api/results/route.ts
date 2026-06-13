import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq, and } from "drizzle-orm";
import { z } from "zod";
import { authOptions, getUserIdByEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { generationSessions, savedResults } from "@/lib/db/schema";

const schema = z.object({
  generationSessionId: z.string().uuid(),
  searchSummary: z.string().min(1),
  finalTitle: z.string().min(1),
  finalThumbnailText: z.string().min(1),
  titleCandidates: z.array(z.string()).min(1),
  thumbnailCandidates: z.array(z.string()).min(1),
  videoOutline: z.array(z.string()).min(1),
  sevenDayPlan: z.array(z.object({ day: z.number(), title: z.string(), task: z.string() })),
  memo: z.string().optional()
});

export async function GET() {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const db = getDb();
  const rows = await db
    .select()
    .from(savedResults)
    .where(and(eq(savedResults.userId, userId), eq(savedResults.isDeleted, false)))
    .orderBy(desc(savedResults.createdAt));
  return NextResponse.json({ results: rows });
}

export async function POST(request: Request) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const body = schema.parse(await request.json());
  const db = getDb();
  const [saved] = await db
    .insert(savedResults)
    .values({
      userId,
      ...body
    })
    .onConflictDoUpdate({
      target: savedResults.generationSessionId,
      set: {
        finalTitle: body.finalTitle,
        finalThumbnailText: body.finalThumbnailText,
        titleCandidates: body.titleCandidates,
        thumbnailCandidates: body.thumbnailCandidates,
        videoOutline: body.videoOutline,
        sevenDayPlan: body.sevenDayPlan,
        memo: body.memo,
        isDeleted: false,
        updatedAt: new Date()
      }
    })
    .returning();

  await db
    .update(generationSessions)
    .set({ userId, status: "saved", updatedAt: new Date() })
    .where(eq(generationSessions.id, body.generationSessionId));

  return NextResponse.json({ result: saved });
}

async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (!session?.user?.email) return null;
  return getUserIdByEmail(session.user.email);
}
