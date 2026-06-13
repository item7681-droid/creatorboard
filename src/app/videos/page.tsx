"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw, Sparkles } from "lucide-react";
import { getCategoryLabel } from "@/lib/youtube/categories";
import type { VideoCandidate } from "@/lib/youtube/types";

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoCandidate[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const diagnosis = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("creatorboard_diagnosis");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    if (!diagnosis) {
      router.replace("/diagnosis");
      return;
    }
    fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: diagnosis.recommendedKeywords,
        categoryId: diagnosis.categoryId
      })
    })
      .then((res) => res.json())
      .then((data) => setVideos(data.videos ?? []))
      .finally(() => setLoading(false));
  }, [diagnosis, router]);

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  }

  function next() {
    localStorage.setItem("creatorboard_selected_videos", JSON.stringify(selected));
    localStorage.setItem("creatorboard_video_candidates", JSON.stringify(videos));
    router.push("/generate");
  }

  const categoryLabel = getCategoryLabel(diagnosis?.categoryId, diagnosis?.knownField);
  const ready = selected.length === 3;

  return (
    <main className="wrap">
      <div className="section-head">
        <div>
          <p className="eyebrow">DAY 2 · 레퍼런스 영상 · {categoryLabel}</p>
          <h1 style={{ fontSize: 46 }}>참고할 영상 3개를 고르세요.</h1>
          <p className="lead" style={{ maxWidth: "none" }}>
            선택한 3개 영상의 제목과 썸네일 문구를 조합해 제목 추천 5개, 썸네일 문구 추천 5개를 만듭니다.
          </p>
        </div>
      </div>
      {loading ? (
        <div className="panel panel-pad">
          <RefreshCw size={18} /> 영상 후보를 불러오는 중입니다.
        </div>
      ) : (
        <>
          <section className="selection-guide panel panel-pad">
            <div>
              <p className="eyebrow">선택 기준</p>
              <h2>따라 만들 수 있을 것 같은 영상 3개를 고르세요.</h2>
              <p className="muted">
                제목, 썸네일 문구, 썸네일 사진, 초반 30초가 참고하기 좋은 영상을 우선 선택하면 됩니다.
              </p>
            </div>
            <div className={`selection-count ${ready ? "ready" : ""}`}>
              <Sparkles size={18} />
              <strong>{selected.length}/3</strong>
              <span>{ready ? "문구 조합 준비 완료" : "선택 중"}</span>
            </div>
          </section>
          <div className="video-candidate-grid">
            {videos.map((video) => (
              <article
                className={`video-card ${selected.includes(video.id) ? "selected" : ""}`}
                key={video.id}
              >
                <div className="thumb-wrap">
                  <Image className="thumb" src={video.thumbnailUrl} alt="" width={480} height={270} />
                  <span className="duration-badge">{formatDuration(video.durationSeconds)}</span>
                </div>
                <div className="video-body">
                  <div className="video-title">{video.title}</div>
                  <div className="video-stats">
                    조회수 {formatCompactCount(video.viewCount)} | 게시일 {formatDate(video.publishedAt)}
                  </div>
                  <div className="channel-row">
                    <span className="channel-avatar">{video.channelTitle.slice(0, 1)}</span>
                    <div className="channel-meta">
                      <strong>{video.channelTitle}</strong>
                      <span>좋아요 {formatCompactCount(video.likeCount)}</span>
                      <span>댓글 {formatCompactCount(video.commentCount)}</span>
                    </div>
                    <button className="select-chip" type="button" onClick={() => toggle(video.id)}>
                      {selected.includes(video.id) ? "선택됨" : "선택"}
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="bottom-action-bar">
            <button className="btn btn-primary btn-large" disabled={!ready} onClick={next}>
              <Check size={18} /> {ready ? "문구 확정으로 이동" : `${selected.length}/3 선택 완료`}
            </button>
          </div>
        </>
      )}
    </main>
  );
}

function formatCompactCount(value: number) {
  if (value >= 10000) {
    return `${Math.round(value / 10000)}만`;
  }
  return value.toLocaleString();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10).replaceAll("-", ".");
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${restSeconds.toString().padStart(2, "0")}`;
}
