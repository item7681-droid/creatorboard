import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin"
  }
});

// /board 및 하위 경로만 보호
export const config = {
  matcher: ["/board", "/board/:path*"]
};
