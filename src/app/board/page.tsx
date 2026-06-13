"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { LogIn, Pencil } from "lucide-react";

type SavedResult = {
  id: string;
  searchSummary: string;
  finalTitle: string;
  finalThumbnailText: string;
  createdAt: string;
};

export default function BoardPage() {
  const { data: session, status } = useSession();
  const [results, setResults] = useState<SavedResult[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/results")
      .then((res) => res.json())
      .then((data) => setResults(data.results ?? []));
  }, [status]);

  if (status === "loading") {
    return <main className="wrap"><div className="panel panel-pad">내 보드를 불러오는 중입니다.</div></main>;
  }

  if (!session) {
    return (
      <main className="wrap">
        <section className="panel panel-pad" style={{ maxWidth: 560, margin: "70px auto" }}>
          <p className="eyebrow">내 보드</p>
          <h1 style={{ fontSize: 42 }}>저장된 검색내역을 보려면<br />로그인이 필요합니다.</h1>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => signIn("google", { callbackUrl: "/board" })}>
              <LogIn size={18} /> Google로 로그인
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="section-head">
        <div>
          <p className="eyebrow">내 보드</p>
          <h1 style={{ fontSize: 46 }}>저장된 검색내역</h1>
          <p className="lead" style={{ maxWidth: "none" }}>저장한 진단 결과와 영상 플랜을 여기서 다시 확인할 수 있습니다.</p>
        </div>
        <Link className="btn btn-primary" href="/diagnosis">새 진단</Link>
      </div>
      <div className="grid">
        {results.length === 0 ? (
          <div className="panel panel-pad">아직 저장된 결과가 없습니다.</div>
        ) : (
          results.map((result) => (
            <Link className="panel panel-pad toolbar" href={`/board/${result.id}`} key={result.id}>
              <div>
                <h3>{result.finalTitle}</h3>
                <p className="muted" style={{ marginTop: 8 }}>
                  {result.searchSummary} · {result.finalThumbnailText}
                </p>
              </div>
              <span className="btn btn-secondary">
                <Pencil size={16} /> 수정
              </span>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
