"use client";

import { useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExternalLink, ImageIcon, Save } from "lucide-react";
import type { GeneratedPlan } from "@/lib/templates/profit";

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const diagnosis = useMemo(() => read("creatorboard_diagnosis"), []);
  const generated = useMemo(() => read("creatorboard_generated") as GeneratedPlan | null, []);
  const finalTitle = typeof window !== "undefined" ? localStorage.getItem("creatorboard_final_title") ?? "" : "";
  const finalThumbnailText =
    typeof window !== "undefined" ? localStorage.getItem("creatorboard_final_thumbnail") ?? "" : "";
  const uploadDescription = buildUploadDescription(finalTitle, diagnosis?.interestTopic, diagnosis?.recommendedKeywords?.[0]);

  async function save() {
    if (!generated || !diagnosis) return;

    if (!session) {
      signIn("google", { callbackUrl: "/upload" });
      return;
    }

    setSaving(true);
    const response = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationSessionId: diagnosis.generationSessionId,
        searchSummary: `${diagnosis.knownField} / ${diagnosis.interestTopic}`,
        finalTitle,
        finalThumbnailText,
        titleCandidates: generated.titleCandidates,
        thumbnailCandidates: generated.thumbnailCandidates,
        videoOutline: generated.videoOutline,
        sevenDayPlan: generated.sevenDayPlan,
        memo: uploadDescription
      })
    });
    setSaving(false);

    if (!response.ok) {
      alert("저장에 실패했습니다.");
      return;
    }

    router.push("/board");
  }

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
          <p className="eyebrow">DAY 7</p>
          <h1 style={{ fontSize: 46 }}>업로드 문장을 정리하고<br />채널에서 확인하세요.</h1>
          <p className="lead" style={{ maxWidth: "none" }}>
            최종 제목을 보여주고, 핵심 키워드를 설명란에 자연스러운 문장으로 넣어 작성합니다.<br />
            업로드 후에는 유튜브 채널에 들어가 영상이 정상적으로 올라갔는지 확인합니다.
          </p>
        </div>
      </div>

      <section className="grid grid-2">
        <div className="panel panel-pad">
          <p className="eyebrow">최종 제목</p>
          <h2>{finalTitle || "선택한 제목이 없습니다."}</h2>
        </div>
        <div className="panel panel-pad">
          <p className="eyebrow">핵심 키워드</p>
          <h2>{diagnosis.recommendedKeywords?.[0] || diagnosis.interestTopic}</h2>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <h2>업로드 설명란 문장</h2>
        <div className="prompt-copy" style={{ marginTop: 16 }}>
          {uploadDescription}
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">썸네일 완성하기</p>
        <h2>업로드 전에 썸네일을 먼저 완성하세요.</h2>
        <div className="day-list" style={{ marginTop: 20 }}>
          <div className="day-card today">
            <div className="day-card-head">
              <span className="num day-num">1</span>
            </div>
            <div>
              <h3>미리캔버스 열기</h3>
              <p className="muted">미리캔버스에 접속해 DAY 3에서 만들어둔 썸네일 디자인을 엽니다.</p>
              <div className="tool-link-list" style={{ marginTop: 10 }}>
                <a className="tool-link" href="https://www.miricanvas.com/" target="_blank" rel="noreferrer">
                  <ImageIcon size={20} />
                  <span>미리캔버스 열기</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">2</span>
            </div>
            <div>
              <h3>촬영한 사진 넣기</h3>
              <p className="muted">DAY 5에서 촬영한 썸네일용 사진을 미리캔버스에 업로드해서 배치합니다. 문구가 잘 보이도록 사진 위치와 크기를 조정하세요.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">3</span>
            </div>
            <div>
              <h3>PNG 파일로 다운로드</h3>
              <p className="muted">완성된 썸네일을 <strong>PNG 파일</strong>로 다운로드합니다. 영상 파일이 있는 폴더에 함께 저장해 한곳에서 관리하세요.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">유튜브 업로드 순서</p>
        <h2>이 순서대로 따라 하세요.</h2>
        <div className="day-list" style={{ marginTop: 20 }}>
          <div className="day-card today">
            <div className="day-card-head">
              <span className="num day-num">1</span>
            </div>
            <div>
              <h3>+ 만들기 → 동영상 업로드</h3>
              <p className="muted">유튜브 우측 상단 <strong>+ 만들기</strong> 버튼을 클릭하고 <strong>동영상 업로드</strong>를 선택합니다.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">2</span>
            </div>
            <div>
              <h3>영상 파일 드래그해서 넣기</h3>
              <p className="muted">DAY 6에서 내보내기 한 영상 파일을 업로드 창으로 끌어다 놓습니다.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">3</span>
            </div>
            <div>
              <h3>최종 제목 작성</h3>
              <p className="muted">위에 있는 최종 제목을 그대로 입력합니다. 공백 포함 35자 이내로 유지하세요.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">4</span>
            </div>
            <div>
              <h3>설명란 붙여넣기</h3>
              <p className="muted">위 업로드 설명란 문장을 복사해서 설명란에 붙여넣습니다.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">5</span>
            </div>
            <div>
              <h3>썸네일 파일 업로드</h3>
              <p className="muted">미리캔버스에서 저장한 썸네일 이미지를 <strong>맞춤 미리보기 이미지</strong>에 업로드합니다.</p>
            </div>
          </div>
          <div className="day-card">
            <div className="day-card-head">
              <span className="num day-num">6</span>
            </div>
            <div>
              <h3>다음 → 공개 설정 후 게시</h3>
              <p className="muted"><strong>다음</strong> 버튼을 눌러 최종 단계까지 이동합니다. 공개 범위를 <strong>공개</strong>로 설정하고 게시하세요.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel panel-pad plan-section">
        <p className="eyebrow">업로드 후 확인</p>
        <div className="day-list">
          <div className="day-card">
            <h3>설명란 확인</h3>
            <p className="muted">핵심 키워드가 자연스럽게 들어갔는지 확인합니다.</p>
          </div>
          <div className="day-card">
            <h3>채널에서 확인</h3>
            <p className="muted">업로드가 끝나면 내 유튜브 채널에 들어가 영상이 정상적으로 보이는지 확인합니다.</p>
          </div>
        </div>
      </section>

      <div className="actions actions-center" style={{ marginBottom: 40 }}>
        <button className="btn btn-primary btn-large" onClick={save} disabled={saving}>
          <Save size={18} /> {session ? "저장" : "로그인 후 저장"}
        </button>
      </div>
    </main>
  );
}

function read(key: string) {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function buildUploadDescription(title: string, interestTopic?: string, keyword?: string) {
  const safeTitle = title || "첫 영상";
  const safeKeyword = keyword || interestTopic || "초보 유튜브 시작";

  return `이번 영상에서는 "${safeTitle}"라는 주제로 ${safeKeyword}에 대해 처음 시작하는 분들도 이해하기 쉽게 정리했습니다. 직접 해볼 수 있는 흐름을 짧게 담았으니, 첫 영상을 준비하는 분들은 필요한 부분부터 따라 해보세요.`;
}
