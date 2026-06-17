import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";
import { authOptions, getUserIdByEmail } from "@/lib/auth/options";
import { getDb } from "@/lib/db";
import { generationSessions } from "@/lib/db/schema";
import { hasEnv } from "@/lib/env";
import { getGuestSessionId } from "@/lib/session/guest";

const schema = z.object({
  generationSessionId: z.string().uuid(),
  completedDay: z.coerce.number().int().min(0).max(7)
});

export async function PATCH(request: Request) {
  if (!hasEnv("DATABASE_URL")) {
    return NextResponse.json({ completedDay: 0, demoMode: true });
  }

  const body = schema.parse(await request.json());
  const userId = await getAuthedUserId();
  const guestSessionId = await getGuestSessionId();

  if (!userId && !guestSessionId) {
    return NextResponse.json({ message: "진행 상태를 저장할 세션이 없습니다." }, { status: 401 });
  }

  const ownerClause =
    userId && guestSessionId
      ? or(eq(generationSessions.userId, userId), eq(generationSessions.sessionId, guestSessionId))
      : userId
        ? eq(generationSessions.userId, userId)
        : eq(generationSessions.sessionId, guestSessionId!);

  const db = getDb();
  const [updated] = await db
    .update(generationSessions)
    .set({ status: `day-${body.completedDay}`, updatedAt: new Date() })
    .where(and(eq(generationSessions.id, body.generationSessionId), ownerClause))
    .returning({ id: generationSessions.id, status: generationSessions.status });

  if (!updated) {
    return NextResponse.json({ message: "진행 세션을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ completedDay: body.completedDay, status: updated.status });
}

async function getAuthedUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (!session?.user?.email) return null;
  return getUserIdByEmail(session.user.email);
}
