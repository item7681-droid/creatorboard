import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

function getLocalAuthCookies(): NextAuthOptions["cookies"] | undefined {
  if (!process.env.NEXTAUTH_URL) {
    return undefined;
  }

  const url = new URL(process.env.NEXTAUTH_URL);
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    return undefined;
  }

  const suffix = `${url.hostname.replaceAll(".", "-")}-${url.port || "default"}`;
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: false
  };

  return {
    sessionToken: {
      name: `next-auth.${suffix}.session-token`,
      options: baseOptions
    },
    callbackUrl: {
      name: `next-auth.${suffix}.callback-url`,
      options: baseOptions
    },
    csrfToken: {
      name: `next-auth.${suffix}.csrf-token`,
      options: baseOptions
    },
    pkceCodeVerifier: {
      name: `next-auth.${suffix}.pkce.code_verifier`,
      options: {
        ...baseOptions,
        maxAge: 60 * 15
      }
    },
    state: {
      name: `next-auth.${suffix}.state`,
      options: {
        ...baseOptions,
        maxAge: 60 * 15
      }
    },
    nonce: {
      name: `next-auth.${suffix}.nonce`,
      options: baseOptions
    }
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  cookies: getLocalAuthCookies(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const db = getDb();
        const googleProfile = profile as typeof profile & { picture?: string };
        if (!profile.sub) {
          return token;
        }

        const googleId = profile.sub;
        const [user] = await db
          .insert(users)
          .values({
            googleId,
            email: profile.email,
            name: profile.name,
            avatarUrl: googleProfile.picture
          })
          .onConflictDoUpdate({
            target: users.googleId,
            set: {
              email: profile.email,
              name: profile.name,
              avatarUrl: googleProfile.picture,
              updatedAt: new Date()
            }
          })
          .returning();
        token.userId = user.id;
        token.googleId = googleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.googleId = String(token.googleId ?? "");
      }
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  }
};

export async function getUserIdByEmail(email: string) {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user?.id;
}
