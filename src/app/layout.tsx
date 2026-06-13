import type { Metadata } from "next";
import Link from "next/link";
import { Clapperboard } from "lucide-react";
import { Providers } from "./providers";
import { DayNav } from "./day-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorBoard",
  description: "첫 영상 주제부터 7일 실행 플랜까지 만드는 유튜브 시작 보드"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <span className="brand-mark">
                <Clapperboard size={18} />
              </span>
              CreatorBoard
            </Link>
            <nav className="nav">
              <DayNav />
              <Link className="btn btn-ghost" href="/board">내 보드</Link>
              <Link className="btn btn-primary" href="/diagnosis">진단 시작</Link>
            </nav>
          </header>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
