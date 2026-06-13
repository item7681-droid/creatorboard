import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usageLimits } from "@/lib/db/schema";

export const DAILY_GENERATION_LIMIT = 3;

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function assertCanGenerate(input: { userId?: string | null; sessionId?: string | null }) {
  const db = getDb();
  const dateKey = todayKey();
  const where = input.userId
    ? and(eq(usageLimits.userId, input.userId), eq(usageLimits.dateKey, dateKey))
    : and(eq(usageLimits.sessionId, input.sessionId ?? ""), eq(usageLimits.dateKey, dateKey));

  const [row] = await db.select().from(usageLimits).where(where).limit(1);
  if ((row?.generationCount ?? 0) >= DAILY_GENERATION_LIMIT) {
    throw new Error("오늘 생성 횟수를 모두 사용했습니다.");
  }
}

export async function incrementGenerationUsage(input: { userId?: string | null; sessionId?: string | null }) {
  const db = getDb();
  const dateKey = todayKey();
  const identity = input.userId ? { userId: input.userId } : { sessionId: input.sessionId ?? "" };

  await db
    .insert(usageLimits)
    .values({
      ...identity,
      dateKey,
      generationCount: 1
    })
    .onConflictDoUpdate({
      target: input.userId
        ? [usageLimits.userId, usageLimits.dateKey]
        : [usageLimits.sessionId, usageLimits.dateKey],
      set: {
        generationCount: sql`${usageLimits.generationCount} + 1`,
        updatedAt: new Date()
      }
    });
}
