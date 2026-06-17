"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, ExternalLink, FileText, Smartphone } from "lucide-react";
import { markCompletedDay } from "@/lib/flow/progress";



export default function ShootingPage() {
  const finalTitle = readText("creatorboard_final_title");
  const finalThumbnailText = readText("creatorboard_final_thumbnail");
  const diagnosis = readJson<{ generationSessionId?: string } | null>("creatorboard_diagnosis", null);

  const [copied, setCopied] = useState<"storyboard" | "thumbnail" | null>(null);

  const storyboardPrompt = buildStoryboardPrompt(finalTitle, finalThumbnailText);
  const thumbnailShotPrompt = buildThumbnailShotPrompt(finalTitle, finalThumbnailText);

  async function copy(type: "storyboard" | "thumbnail") {
    const text = type === "storyboard" ? storyboardPrompt : thumbnailShotPrompt;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <main className="wrap">

      {/* ── 헤더 ── */}
      <div className="section-head">
        <div>
          <p className="eyebrow">DAY 5 · 스마트폰 촬영 & 썸네일 사진 촬영</p>
          <h1 style={{ fontSize: 46 }}>스토리보드대로<br />찍어오세요.</h1>
          <div className="lead lead-stack" style={{ maxWidth: "none" }}>
            <p>
              GPT가 만든 2분 구성안을 바탕으로 스토리보드를 정리하고,<br />
              그대로 스마트폰으로 촬영합니다.
            </p>
            <p>
              완벽한 화질보다 <strong>구성안대로 끊김 없이 찍는 것</strong>이 먼저입니다.<br />
              썸네일용 사진도 촬영 중에 함께 찍어두면 따로 시간을 내지 않아도 됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 확정 문구 ── */}
      <section className="grid grid-2" style={{ marginBottom: 16 }}>
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
            <a className="tool-link" href="https://docs.google.com/" target="_blank" rel="noreferrer">
              <FileText size={20} />
              <span>Google Docs 열기</span>
              <ExternalLink size={16} />
            </a>
          </div>
          <p className="muted" style={{ lineHeight: 1.7, marginTop: 14 }}>
            Google Docs에 저장한 2분 구성안을 복사하여 스토리보드로 만들어주세요.<br />
            DAY 4에서 작성한 같은 문서에 이어서 스토리보드도 정리하면 문서 관리가 편합니다.
          </p>
        </div>
      </section>

      {/* ── 스토리보드 GPT 프롬프트 ── */}
      <section className="panel panel-pad plan-section">
        <p className="eyebrow">GPT에 넣을 프롬프트 ① — 스토리보드 만들기</p>
        <h2>2분 구성안을 스토리보드로 바꾸기</h2>
        <p className="muted" style={{ lineHeight: 1.7, marginTop: 10 }}>
          DAY 4에서 GPT가 만들어준 2분 구성안을 복사한 뒤, 아래 프롬프트 뒤에 붙여넣으세요.<br />
          장면별로 촬영할 내용과 나레이션이 한눈에 정리된 스토리보드가 나옵니다.
        </p>
        <div className="prompt-box" style={{ marginTop: 16 }}>
          <div className="prompt-head">
            <div>
              <p className="eyebrow">복사해서 GPT에 넣을 프롬프트</p>
              <p>프롬프트를 복사한 뒤 DAY 4 구성안을 이어서 붙여넣으세요.</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => copy("storyboard")}>
              {copied === "storyboard" ? <Check size={16} /> : <Copy size={16} />}
              {copied === "storyboard" ? "복사됨" : "복사"}
            </button>
          </div>
          <div className="prompt-copy">{storyboardPrompt}</div>
        </div>
      </section>

      {/* ── 썸네일 사진 GPT 프롬프트 ── */}
      <section className="panel panel-pad plan-section">
        <p className="eyebrow">GPT에 넣을 프롬프트 ② — 썸네일 사진 구성안</p>
        <h2>어떤 사진을 찍어야 할지 정하기</h2>
        <p className="muted" style={{ lineHeight: 1.7, marginTop: 10 }}>
          썸네일용 사진은 영상 촬영과 같은 날 함께 찍어두는 게 가장 효율적입니다.<br />
          어떤 사진이 필요한지 GPT에게 먼저 물어보고 목록을 만들어 두세요.
        </p>
        <div className="prompt-box" style={{ marginTop: 16 }}>
          <div className="prompt-head">
            <div>
              <p className="eyebrow">복사해서 GPT에 넣을 프롬프트</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => copy("thumbnail")}>
              {copied === "thumbnail" ? <Check size={16} /> : <Copy size={16} />}
              {copied === "thumbnail" ? "복사됨" : "복사"}
            </button>
          </div>
          <div className="prompt-copy">{thumbnailShotPrompt}</div>
        </div>
      </section>


      {/* ── 촬영 팁 ── */}
      <section className="panel panel-pad plan-section">
        <p className="eyebrow">스마트폰 촬영 체크리스트</p>
        <div className="shooting-checklist">
          <div className="shooting-tip">
            <Smartphone size={18} />
            <div>
              <strong>가로로 찍기</strong>
              <p className="muted">유튜브는 16:9 비율입니다. 스마트폰을 가로로 들고 찍으세요.<br />어려운 가로영상을 먼저 연습하면 숏츠영상은 바로 할 수 있어요.</p>
            </div>
          </div>
          <div className="shooting-tip">
            <Smartphone size={18} />
            <div>
              <strong>짧게 먼저 찍어보기</strong>
              <p className="muted">본촬영 전에 5~10초짜리 테스트 영상을 찍어 화면 구도, 밝기, 소리를 확인하세요. 확인 후 길게 촬영하세요.</p>
            </div>
          </div>
          <div className="shooting-tip">
            <Smartphone size={18} />
            <div>
              <strong>썸네일 사진 따로 찍기</strong>
              <p className="muted">촬영 중간에 썸네일용 사진도 찍어두세요. 별도로 시간을 내지 않아도 됩니다.</p>
            </div>
          </div>
          <div className="shooting-tip">
            <Smartphone size={18} />
            <div>
              <strong>카카오톡 나에게 보내기</strong>
              <p className="muted">
                촬영이 끝나면 영상 파일을 카카오톡 나에게 보내기로 PC에 옮깁니다.<br />
                보내기 전에 화질 설정을 확인하세요.<br />
                설정(톱니바퀴) → 데이터 및 저장공간 → 사진 화질 <strong>원본</strong> / 동영상 화질 <strong>고화질</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">파일 정리</p>
        <h2>DAY 4에서 만든 폴더에 영상과 사진을 담으세요.</h2>
        <p className="muted" style={{ lineHeight: 1.7, marginTop: 10 }}>
          녹음 파일과 자막 파일이 들어있는 폴더에 오늘 촬영한 파일도 함께 보관하세요.<br />
          DAY 6 편집 시 모든 파일이 한 폴더에 있으면 캡컷에서 바로 불러올 수 있습니다.
        </p>
        <div className="day-list" style={{ marginTop: 16 }}>
          <div className="day-card today">
            <h3>영상 파일</h3>
            <p className="muted">카카오톡 나에게 보내기로 받은 촬영 영상 파일을 폴더에 저장합니다.</p>
          </div>
          <div className="day-card">
            <h3>썸네일 사진 파일</h3>
            <p className="muted">촬영 중 찍어둔 썸네일용 사진도 같은 폴더에 저장합니다.</p>
          </div>
        </div>
      </section>

      <div className="actions actions-end" style={{ marginBottom: 40 }}>
        <Link className="btn btn-secondary" href="/result">
          ← DAY 4로 돌아가기
        </Link>
        <Link
          className="btn btn-primary btn-large"
          href="/edit"
          onClick={() => markCompletedDay(5, diagnosis?.generationSessionId)}
        >
          DAY 6 편집하기 →
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

function buildStoryboardPrompt(title: string, thumbnailText: string) {
  return `아래에 내 2분 영상 구성안이 있습니다.

내 최종 제목: ${title || "선택한 제목"}
내 썸네일 문구: ${thumbnailText || "선택한 썸네일 문구"}

요청:
구성안을 장면(씬)별 스토리보드로 정리해 주세요.
각 장면은 아래 형식으로 작성해주세요.

[씬 번호] 장면 이름 (예상 시간)
- 촬영 내용: 스마트폰으로 어떤 장면을 찍어야 하는지 구체적으로 설명 (예: 책상에 앉아 카메라를 바라보며 말하기, 물건 클로즈업 등)
- 나레이션: 이 장면에서 말할 대사 전문

초보자가 스마트폰 하나로 촬영할 수 있는 수준으로 작성해 주세요.
아래에 2분 구성안을 붙여넣겠습니다.`;
}

function buildThumbnailShotPrompt(title: string, thumbnailText: string) {
  return `내 유튜브 영상 썸네일에 쓸 사진을 직접 촬영하려고 합니다.

내 최종 제목: ${title || "선택한 제목"}
내 썸네일 문구: ${thumbnailText || "선택한 썸네일 문구"}

요청:
1. 이 제목과 문구에 어울리는 썸네일 사진 아이디어를 5가지 제안해 주세요.
2. 각 아이디어에 대해 스마트폰으로 직접 찍을 수 있는 구체적인 촬영 방법을 알려주세요.
3. 사람이 등장하는 사진과 사물/화면만 있는 사진 각각 최소 1가지씩 포함해 주세요.
4. 썸네일 문구를 넣었을 때 가독성이 좋은 배경 구성도 함께 알려주세요.

초보자가 집이나 카페에서 스마트폰으로 혼자 찍을 수 있는 방법이어야 합니다.`;
}
