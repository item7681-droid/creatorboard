"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FileText, ImageIcon } from "lucide-react";
import type { VideoCandidate } from "@/lib/youtube/types";

export default function ThumbnailPage() {
  const finalTitle = readText("creatorboard_final_title");
  const finalThumbnailText = readText("creatorboard_final_thumbnail");
  const selectedIds = readJson<string[]>("creatorboard_selected_videos", []);
  const candidates = readJson<VideoCandidate[]>("creatorboard_video_candidates", []);
  const selectedVideos = selectedIds
    .map((id) => candidates.find((video) => video.id === id))
    .filter((video): video is VideoCandidate => Boolean(video));

  return (
    <main className="wrap">
      <section className="section-head">
        <div>
          <p className="eyebrow">DAY 3 · 썸네일 만들기</p>
          <h1 style={{ fontSize: 46 }}>선택한 문구로 썸네일과<br />사진 구성안을 잡아보세요.</h1>
          <div className="lead lead-stack" style={{ maxWidth: "none" }}>
            <p>
              뜨는 영상의 썸네일을 참고하되 그대로 따라 하지 말고,<br />
              확정한 제목과 썸네일 문구가 가장 잘 보이는 사진 구성을 정합니다.
            </p>
            <p>
              썸네일의 목표는 예쁘게 꾸미는 것이 아니라 사람들이 눌러보고 싶게 만드는 것입니다.<br />
              초보자는 글씨체나 색깔을 꾸미는 데 시간을 많이 쓰기 쉽지만,<br />
              먼저 중요한 것은 &ldquo;나도 저 상황 알아&rdquo;라고 느끼게 하는 사진입니다.
            </p>
            <p>
              여기에 &ldquo;이건 봐야겠다&rdquo;라는 생각이 드는 짧은 문구가 붙으면 좋습니다.<br />
              디자인이 조금 투박해도 공감되는 이미지와 후킹한 문구가 있으면 클릭될 가능성이 높아집니다.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="panel panel-pad">
          <p className="eyebrow">확정한 문구</p>
          <div className="final-copy-list">
            <div>
              <span>제목</span>
              <strong>{finalTitle || "선택한 제목이 없습니다."}</strong>
            </div>
            <div>
              <span>썸네일 문구</span>
              <strong>{finalThumbnailText || "선택한 썸네일 문구가 없습니다."}</strong>
            </div>
          </div>
        </div>

        <div className="panel panel-pad">
          <p className="eyebrow">작업 도구</p>
          <div className="tool-link-list">
            <a className="tool-link" href="https://www.miricanvas.com/" target="_blank" rel="noreferrer">
              <ImageIcon size={20} />
              <span>미리캔버스 열기</span>
              <ExternalLink size={16} />
            </a>
            <a className="tool-link" href="https://docs.google.com/" target="_blank" rel="noreferrer">
              <FileText size={20} />
              <span>사진 구성안 작성하기</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">사진 구성안 생각하기</p>
        <div className="day-list">
          <div className="day-card today">
            <h3>문구가 먼저 보이게 하기</h3>
            <p className="muted">확정한 썸네일 문구를 가장 크게 배치하고, 사진은 문구를 방해하지 않는 공간에 넣습니다.</p>
          </div>
          <div className="day-card">
            <h3>사진 후보 정하기</h3>
            <div className="muted copy-stack">
              <p>단순히 예쁜 사진이 아니라, 내가 정한 제목과 문구를 클릭하고 싶은 이유를 시각적으로 강화하는 이미지를 찾습니다.</p>
              <p>핵심은 우리 채널에 모여 있는 타겟층이 겪는 문제 상황에 대한 공감입니다.</p>
              <p>얼굴, 손, 물건, 화면 캡처, 작업 장면 중 어떤 사진이 그 문제를 가장 빨리 보여주는지 적어봅니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">앞에서 선택한 영상 썸네일 3가지</p>
        {selectedVideos.length > 0 ? (
          <div className="thumbnail-reference-grid">
            {selectedVideos.map((video) => (
              <article className="thumbnail-reference-card" key={video.id}>
                <Image className="thumb" src={video.thumbnailUrl} alt="" width={480} height={270} />
                <div>
                  <h3>{video.title}</h3>
                  <p className="muted">{video.thumbnailText}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">선택한 영상 정보가 없습니다. DAY 2에서 영상 3개를 먼저 골라주세요.</p>
        )}
      </section>

      <div className="actions actions-center">
        <Link className="btn btn-primary btn-large" href="/result">
          DAY 4 2분 구성안 보기
        </Link>
      </div>
    </main>
  );
}

function readText(key: string) {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
