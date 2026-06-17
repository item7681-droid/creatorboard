import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
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
