import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authOptions, getUserIdByEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { savedResults } from "@/lib/db/schema";

const schema = z.object({
  finalTitle: z.string().min(1).optional(),
  finalThumbnailText: z.string().min(1).optional(),
  videoOutline: z.array(z.string()).min(1).optional(),
  sevenDayPlan: z.array(z.object({ day: z.number(), title: z.string(), task: z.string() })).optional(),
  memo: z.string().optional()
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  const [result] = await db
    .select()
    .from(savedResults)
    .where(and(eq(savedResults.id, id), eq(savedResults.userId, userId), eq(savedResults.isDeleted, false)))
    .limit(1);

  if (!result) return NextResponse.json({ message: "결과를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ result });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const body = schema.parse(await request.json());
  const db = getDb();
  const [result] = await db
    .update(savedResults)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(savedResults.id, id), eq(savedResults.userId, userId), eq(savedResults.isDeleted, false)))
    .returning();

  if (!result) return NextResponse.json({ message: "결과를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ result });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getAuthedUserId();
  if (!userId) return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });

  const { id } = await params;
  const db = getDb();
  await db
    .update(savedResults)
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(and(eq(savedResults.id, id), eq(savedResults.userId, userId)));

  return NextResponse.json({ ok: true });
}

async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (!session?.user?.email) return null;
  return getUserIdByEmail(session.user.email);
}
