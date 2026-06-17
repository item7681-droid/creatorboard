"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

type ResultDetail = {
  id: string;
  finalTitle: string;
  finalThumbnailText: string;
  titleCandidates: string[];
  thumbnailCandidates: string[];
  representativeCategory?: string;
  interestTopic?: string;
  recommendedKeywords?: string[];
  recommendedCategories?: string | null;
  completedDay: number;
};

export default function ResultDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ResultDetail | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetch(`/api/results/${params.id}`)
      .then((res) => {
        if (res.status === 401) router.replace("/signin");
        return res.json();
      })
      .then((data) => {
        if (data.result) {
          setResult(data.result);
        }
      });
  }, [params.id, router]);

  async function handleRemove() {
    if (!result || removing) return;
    const confirmed = window.confirm("정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmed) return;
    setRemoving(true);
    await fetch(`/api/results/${result.id}`, { method: "DELETE" });
    router.push("/board");
  }

  if (!result) {
    return (
      <main className="wrap">
        <div className="panel panel-pad">결과를 불러오는 중입니다.</div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <section className="section-head">
        <div>
          <p className="eyebrow">저장 결과 수정</p>
          <h1 style={{ fontSize: 46 }}>첫 영상 계획을 다듬으세요.</h1>
        </div>
          <button className="btn btn-secondary" onClick={handleRemove} disabled={removing}>
            <Trash2 size={18} /> {removing ? "삭제 중..." : "삭제"}
          </button>
      </section>

      {/* DAY 1 — 진단 결과 */}
      <section className="panel panel-pad">
        <p className="eyebrow">DAY 1 · 진단 결과</p>
        <div className="board-diagnosis-meta board-diagnosis-meta-detail" style={{ marginTop: 12 }}>
          {result.representativeCategory && (
            <span>대표 분류: {result.representativeCategory}</span>
          )}
          {result.interestTopic && (
            <span>관심 주제: {result.interestTopic}</span>
          )}
          {result.recommendedCategories && (
            <span>추천 카테고리: {result.recommendedCategories}</span>
          )}
          {result.recommendedKeywords?.length ? (
            <span>영상 검색 키워드: {result.recommendedKeywords.join(", ")}</span>
          ) : null}
        </div>
      </section>

      {/* DAY 2 — 제목 & 썸네일 */}
      {result.completedDay >= 2 && (
        <section className="panel panel-pad">
          <p className="eyebrow">DAY 2 · 제목 &amp; 썸네일 문구</p>
          <div className="board-diagnosis-meta board-diagnosis-meta-detail" style={{ marginTop: 12 }}>
            <span>최종 제목: {result.finalTitle}</span>
            <span>썸네일 문구: {result.finalThumbnailText}</span>
          </div>
        </section>
      )}
    </main>
  );
}
