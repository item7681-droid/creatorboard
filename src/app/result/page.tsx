"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy, ExternalLink, FileText, Mic, Puzzle, Wand2 } from "lucide-react";
import type { GeneratedPlan } from "@/lib/templates/profit";
import type { VideoCandidate } from "@/lib/youtube/types";

export default function ResultPage() {
  const [copied, setCopied] = useState(false);
  const diagnosis = read("creatorboard_diagnosis");
  const generated = read("creatorboard_generated") as GeneratedPlan | null;
  const finalTitle = readText("creatorboard_final_title");
  const finalThumbnailText = readText("creatorboard_final_thumbnail");
  const selectedIds = readJson<string[]>("creatorboard_selected_videos", []);
  const candidates = readJson<VideoCandidate[]>("creatorboard_video_candidates", []);
  const selectedVideos = selectedIds
    .map((id) => candidates.find((video) => video.id === id))
    .filter((video): video is VideoCandidate => Boolean(video));
  const gptPrompt = buildGptPrompt(finalTitle, finalThumbnailText);

  if (!generated || !diagnosis) {
    return (
      <main className="wrap">
        <div className="notice">생성 결과가 없습니다. 진단부터 다시 시작해주세요.</div>
      </main>
    );
  }

  return (
    <main className="wrap">
      <div className="section-head">
        <div>
          <p className="eyebrow">DAY 4 · 영상 구성안</p>
          <h1 style={{ fontSize: 46 }}>스크립트를 조합해<br />2분 영상 구성안을 만드세요.</h1>
          <div className="lead lead-stack" style={{ maxWidth: "none" }}>
            <p>처음 하는 사람은 먼저 LiveWiki 확장프로그램을 설치하세요.</p>
            <p>
              그 다음 선택한 3개 영상의 스크립트를 복사해서 GPT에 넣고,<br />
              내 제목과 썸네일 문구에 맞는 2분 영상 흐름으로 정리합니다.
            </p>
          </div>
        </div>
      </div>

      <section className="notice notice-strong">
        <strong>가장 먼저 할 일: LiveWiki 확장프로그램 설치</strong>
        <span>스크립트를 복사하려면 유튜브 영상 내용을 텍스트로 보여주는 확장프로그램이 필요합니다.</span>
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
          <p className="eyebrow">LiveWiki 준비</p>
          <h2>처음이면 여기부터 하세요.</h2>
          <div className="tool-link-list">
            <a
              className="tool-link"
              href="https://livewiki.com/ko"
              target="_blank"
              rel="noreferrer"
            >
              <Puzzle size={20} />
              <span>LiveWiki 열기</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="copy-stack muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
            <p>1. 버튼을 눌러 LiveWiki 사이트로 이동합니다.</p>
            <p>2. LiveWiki 오른쪽 상단의 확장 프로그램 설치 버튼을 눌러 설치합니다.</p>
            <p>3. 설치가 끝나면 아래 선택한 유튜브 영상을 열어 스크립트를 복사합니다.</p>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">유튜브 영상에서 스크립트 복사하는 방법</p>
        <div className="day-list">
          <div className="day-card">
            <h3>1. 선택한 영상 열기</h3>
            <p className="muted">아래 영상 링크를 눌러 유튜브 영상을 엽니다.</p>
          </div>
          <div className="day-card">
            <h3>2. LiveWiki에서 스크립트 확인</h3>
            <p className="muted">영상 옆 또는 확장프로그램 화면에서 스크립트가 보이면 전체 내용을 복사합니다.</p>
          </div>
          <div className="day-card">
            <h3>3. 3개 영상 모두 반복</h3>
            <p className="muted">각 영상의 스크립트를 영상 1, 영상 2, 영상 3으로 구분해서 GPT에 붙여넣습니다.</p>
          </div>
          <div className="day-card">
            <h3>4. 그대로 베끼지 않기</h3>
            <p className="muted">스크립트는 참고용입니다. 표현과 순서는 내 경험과 말투에 맞게 다시 구성해야 합니다.</p>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">선택한 3개 영상 링크</p>
        {selectedVideos.length > 0 ? (
          <div className="thumbnail-reference-grid">
            {selectedVideos.map((video) => (
              <article className="thumbnail-reference-card" key={video.id}>
                <Image className="thumb" src={video.thumbnailUrl} alt="" width={480} height={270} />
                <div>
                  <h3>{video.title}</h3>
                  <a
                    className="btn btn-secondary"
                    href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    영상 열기 <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">선택한 영상 정보가 없습니다. DAY 2에서 영상 3개를 먼저 골라주세요.</p>
        )}
      </section>

      <section className="panel panel-pad plan-section">
        <div className="prompt-box">
          <div className="prompt-head">
            <div>
              <p className="eyebrow">GPT에 넣을 프롬프트</p>
              <p>아래 문구를 복사한 뒤, 선택한 3개 영상의 스크립트를 이어서 붙여넣으세요.</p>
            </div>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(gptPrompt);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
          <div className="prompt-copy">{gptPrompt}</div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">나온 결과 정리하기</p>
        <div className="tool-link-list">
          <a className="tool-link" href="https://docs.google.com/" target="_blank" rel="noreferrer">
            <FileText size={20} />
            <span>Google Docs에 구성안 붙여넣기</span>
            <ExternalLink size={16} />
          </a>
        </div>
        <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
          GPT가 만든 2분 구성안을 복사해서 Google Docs에 붙여넣습니다.<br />
          DAY 3에서 작성한 사진 구성안도 같은 문서에 이어서 정리하면 촬영할 때 보기 쉽습니다.
        </p>
      </section>

      <section className="grid grid-2 plan-section">
        <div className="panel panel-pad">
          <p className="eyebrow">나레이션 녹음</p>
          <div className="copy-stack muted" style={{ lineHeight: 1.7 }}>
            <p>핸드폰 녹음 기능으로 2분 구성안을 읽으며 나레이션을 녹음합니다.</p>
            <p>녹음이 끝나면 공유 버튼으로 카카오톡 나에게 보내기를 합니다.</p>
            <p>PC 카카오톡에서 녹음파일을 다운로드해 편집 준비를 합니다.</p>
          </div>
        </div>
        <div className="panel panel-pad">
          <p className="eyebrow">자막 만들기</p>
          <div className="tool-link-list">
            <a className="tool-link" href="https://vrew.voyagerx.com/ko/" target="_blank" rel="noreferrer">
              <Mic size={20} />
              <span>Vrew 열기</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <div className="copy-stack muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
            <p>다운로드한 녹음파일을 Vrew에 넣어 자막을 만듭니다.</p>
            <p>자막을 먼저 만들면 촬영과 편집 흐름을 잡기 쉽습니다.</p>
            <p>완성된 자막은 <strong style={{ color: "var(--soft)" }}>SRT 파일</strong>로 내보내기 해두세요.</p>
            <p>캡컷에서 자막 파일로 바로 불러올 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">파일 정리</p>
        <h2>촬영 전에 폴더를 먼저 만들어두세요.</h2>
        <p className="muted" style={{ lineHeight: 1.7, marginTop: 10 }}>
          영상 프로젝트 전용 폴더를 하나 만들고, 아래 파일을 모두 그 안에 보관하세요.<br />
          나중에 파일을 찾느라 시간을 낭비하지 않아도 됩니다.
        </p>
        <div className="day-list" style={{ marginTop: 16 }}>
          <div className="day-card today">
            <h3>녹음 파일</h3>
            <p className="muted">카카오톡 나에게 보내기로 받은 나레이션 녹음 파일을 폴더에 저장합니다.</p>
          </div>
          <div className="day-card">
            <h3>자막 파일 (SRT)</h3>
            <p className="muted">Vrew에서 내보내기 한 SRT 파일을 같은 폴더에 저장합니다.</p>
          </div>
        </div>
      </section>

      <div className="actions actions-center">
        <Link className="btn btn-primary btn-large" href="/shooting">
          DAY 5 스토리보드 & 촬영
        </Link>
      </div>
    </main>
  );
}

function read(key: string) {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
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

function buildGptPrompt(title: string, thumbnailText: string) {
  return `아래에는 내가 참고하려는 유튜브 영상 3개의 스크립트가 있습니다.

내 최종 제목: ${title || "선택한 제목"}
내 썸네일 문구: ${thumbnailText || "선택한 썸네일 문구"}

요청:
1. 세 영상의 공통 흐름과 좋은 포인트를 뽑아주세요.
2. 그대로 베끼지 말고, 초보자가 자연스럽게 말할 수 있는 2분 영상 구성안으로 다시 만들어주세요.
3. 구성은 오프닝 10초, 문제 공감, 핵심 내용 3개, 마무리 행동 제안 순서로 작성해주세요.
4. 말투는 쉽고 친근하게, 초등학생도 이해할 수 있게 써주세요.
5. 영상에서 바로 읽을 수 있는 나레이션 초안도 함께 만들어주세요.

아래에 영상 1, 영상 2, 영상 3 스크립트를 붙여넣겠습니다.`;
}
