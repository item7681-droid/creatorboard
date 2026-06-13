import { cookies } from "next/headers";
import { nanoid } from "nanoid";

const COOKIE_NAME = "creatorboard_session";

export async function getOrCreateGuestSessionId() {
  const store = await cookies();
  const current = store.get(COOKIE_NAME)?.value;
  if (current) return current;

  const sessionId = nanoid(32);
  store.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return sessionId;
}

export async function getGuestSessionId() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value;
}
