"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, KeyRound, RefreshCw, Sparkles } from "lucide-react";
import { cacheCompletedDay, markCompletedDay } from "@/lib/flow/progress";
import { getCategoryLabel } from "@/lib/youtube/categories";
import type { VideoCandidate } from "@/lib/youtube/types";

type DiagnosisFlow = {
  knownField: string;
  categoryId?: string;
  generationSessionId?: string;
  recommendedKeywords: string[];
};

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoCandidate[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [hasSavedApiKey, setHasSavedApiKey] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisFlow | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("creatorboard_youtube_api_key") ?? "";
      setApiKey(savedKey);
      setHasSavedApiKey(Boolean(savedKey.trim()));
    }
  }, []);

  const loadVideos = useCallback(async (key: string) => {
    if (!diagnosis) return;
    if (!key.trim()) {
      setVideos([]);
      setSelected([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSelected([]);
    const response = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: diagnosis.recommendedKeywords,
        categoryId: diagnosis.categoryId,
        youtubeApiKey: key
      })
    });
    const data = await response.json();
    setVideos(data.videos ?? []);
    setLoading(false);
  }, [diagnosis]);

  useEffect(() => {
    async function restoreDiagnosis() {
      const raw = localStorage.getItem("creatorboard_diagnosis");
      if (raw) {
        setDiagnosis(JSON.parse(raw));
        return;
      }

      const response = await fetch("/api/flow/current");
      if (!response.ok) {
        router.replace("/diagnosis");
        return;
      }

      const data = await response.json();
      if (!data.diagnosis) {
        router.replace("/diagnosis");
        return;
      }

      localStorage.setItem("creatorboard_diagnosis", JSON.stringify(data.diagnosis));
      if (typeof data.progress?.completedDay === "number") {
        cacheCompletedDay(data.progress.completedDay);
      }
      setDiagnosis(data.diagnosis);
    }

    restoreDiagnosis();
  }, [router]);

  useEffect(() => {
    if (!diagnosis) return;
    loadVideos(localStorage.getItem("creatorboard_youtube_api_key") ?? "");
  }, [diagnosis, loadVideos]);

  function saveApiKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const key = apiKey.trim();
    if (key) {
      localStorage.setItem("creatorboard_youtube_api_key", key);
    } else {
      localStorage.removeItem("creatorboard_youtube_api_key");
    }
    setHasSavedApiKey(Boolean(key));
    loadVideos(key);
  }

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  }

  async function next() {
    localStorage.setItem("creatorboard_selected_videos", JSON.stringify(selected));
    localStorage.setItem("creatorboard_video_candidates", JSON.stringify(videos));
    await markCompletedDay(2, diagnosis?.generationSessionId);
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
            선택한 3개 영상의 제목, 썸네일 문구, 썸네일 사진, 초반 30초를 참고해서 다음 단계에서 제목과 썸네일 문구를 조합합니다.
          </p>
        </div>
      </div>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">YouTube Data API 키 설정</p>
        <h2>내 API 키를 넣으면 실제 YouTube 영상 후보를 불러올 수 있습니다.</h2>
        <div className="copy-stack muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
          <p>
            CreatorBoard가 만든 공용 API 키를 모든 사용자에게 넣어두면 키가 노출되거나, 하루 사용량이 한 번에 소진될 수 있습니다. 그래서
            보안과 안정성을 위해 사용자가 각자 Google Cloud에서 발급한 API 키를 넣어 쓰는 구조가 안전합니다.
          </p>
          <p>
            입력한 키는 영상 후보를 불러오는 요청에만 사용하고, DB에는 저장하지 않습니다. 이 브라우저에서 다시 쓰기 쉽도록 내 컴퓨터의
            localStorage에만 보관됩니다.
          </p>
        </div>

        <div className="api-guide-grid">
          <div className="day-card">
            <h3>1. Google 계정 로그인</h3>
            <p className="muted">
              Google 계정으로 로그인합니다.<br />
              이후 새 프로젝트를 선택합니다.
            </p>
            <a className="inline-link" href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">
              Google Cloud Console 열기 <ExternalLink size={14} />
            </a>
          </div>
          <div className="day-card">
            <h3>2. 새 프로젝트 만들기</h3>
            <p className="muted">
              상단 바에서 프로젝트 선택을 클릭합니다.<br />
              새 프로젝트를 누릅니다.<br />
              프로젝트 이름은 youtube-creatorboard처럼 영문으로 입력합니다.<br />
              만들기를 클릭한 뒤 잠시 기다립니다.
            </p>
          </div>
          <div className="day-card">
            <h3>3. YouTube Data API v3 활성화</h3>
            <p className="muted">
              API 및 서비스 → 라이브러리로 이동합니다.<br />
              YouTube Data API v3를 선택합니다.<br />
              사용 버튼을 클릭합니다.
            </p>
            <a
              className="inline-link"
              href="https://console.cloud.google.com/apis/library/youtube.googleapis.com?project=creatorboard-499111"
              target="_blank"
              rel="noreferrer"
            >
              YouTube Data API v3 열기 <ExternalLink size={14} />
            </a>
          </div>
          <div className="day-card">
            <h3>4. API 키 생성</h3>
            <p className="muted">
              API 및 서비스 → 사용자 인증 정보로 이동합니다.<br />
              + 사용자 인증 정보 만들기 → API 키 만들기를 클릭합니다.<br />
              이름은 youtube-creatorboard처럼 프로젝트 이름과 동일하게 작성합니다.<br />
              API 제한사항에서 YouTube Data API v3를 선택합니다.<br />
              확인 → 만들기를 누른 뒤 API 키를 복사합니다.
            </p>
            <a
              className="inline-link"
              href="https://console.cloud.google.com/apis/credentials?project=creatorboard-499111"
              target="_blank"
              rel="noreferrer"
            >
              사용자 인증 정보 열기 <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="notice" style={{ marginTop: 16 }}>
          검색 API는 1회 100 units라 하루 약 100회 검색 가능합니다. 다만 영상 상세 조회를 같이 하면 실제 가능 횟수는 그보다 줄어듭니다.
        </div>

        <form className="api-key-form" onSubmit={saveApiKey}>
          <label className="field">
            <span>YouTube Data API 키</span>
            <input
              className="input"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="AIza..."
              type="password"
            />
          </label>
          <button className="btn btn-primary" type="submit">
            <KeyRound size={18} /> API 키 저장하고 영상 불러오기
          </button>
        </form>
      </section>

      {!hasSavedApiKey ? null : loading ? (
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
              <article className={`video-card ${selected.includes(video.id) ? "selected" : ""}`} key={video.id}>
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
