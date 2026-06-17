"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, Target, BookmarkPlus, LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { getCategoryLabel } from "@/lib/youtube/categories";

type MBTIEntry = {
  title: string;
  categories: string;
  formats: string;
  concept: string;
  firstVideo: string;
  categoryId: string;
  knownField: string;
  interestTopic: string;
};

type DiagnosisResult = {
  knownField: string;
  categoryId?: string;
  interestTopic: string;
  recommendedKeywords: string[];
  generationSessionId?: string;
  mbtiType?: string;
  mbtiEntry?: MBTIEntry;
};

export default function DiagnosisResultPage() {
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const { data: session } = useSession();

  useEffect(() => {
    async function loadDiagnosis() {
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
      setDiagnosis(data.diagnosis);
    }

    loadDiagnosis();
  }, [router]);

  if (!diagnosis) {
    return <main className="wrap"><div className="panel panel-pad">진단 결과를 불러오는 중입니다.</div></main>;
  }

  const mbti = diagnosis.mbtiType;
  const entry = diagnosis.mbtiEntry;
  const koreanCategory = getCategoryLabel(diagnosis.categoryId, diagnosis.knownField);
  const displayKeywords = diagnosis.recommendedKeywords ?? [];
  const firstKeyword = entry?.firstVideo ?? displayKeywords[0] ?? `${koreanCategory} 첫 영상`;
  const sevenDayPlan = createSevenDayPlan(koreanCategory, diagnosis.interestTopic, firstKeyword);

  const profilePrompt = `나는 유튜브 첫 영상을 준비하고 있습니다.${mbti ? ` 내 콘텐츠 유형은 ${mbti}(${entry?.title})입니다.` : ""} 주제는 "${firstKeyword}"이고, 방향은 "${koreanCategory}"입니다.
초보자가 바로 사용할 수 있게 채널명 10개, 소개 문구 5개, 프로필 이미지 아이디어 5개를 추천해주세요.
너무 전문가처럼 보이기보다 처음 시작하는 사람이 꾸준히 운영할 수 있는 느낌이면 좋겠습니다.`;

  async function copyPrompt() {
    await navigator.clipboard.writeText(profilePrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleSave() {
    if (!diagnosis) return;

    if (!session) {
      signIn("google", { callbackUrl: "/diagnosis/result" });
      return;
    }

    if (!diagnosis.generationSessionId) {
      alert("저장할 진단 세션이 없습니다. 진단을 다시 진행해 주세요.");
      return;
    }

    setSaveState("saving");
    const titleCandidates = [firstKeyword, ...displayKeywords].filter(Boolean);
    const thumbnailCandidates = [
      diagnosis.interestTopic,
      koreanCategory,
      entry?.concept ?? firstKeyword
    ].filter(Boolean);
    const response = await fetch("/api/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationSessionId: diagnosis.generationSessionId,
        searchSummary: `${diagnosis.knownField} / ${diagnosis.interestTopic}`,
        finalTitle: firstKeyword,
        finalThumbnailText: diagnosis.interestTopic,
        titleCandidates,
        thumbnailCandidates,
        videoOutline: sevenDayPlan.map((day) => `DAY ${day.day}. ${day.title}: ${day.task}`),
        sevenDayPlan,
        memo: profilePrompt
      })
    });

    if (!response.ok) {
      setSaveState("idle");
      alert("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setSaveState("saved");
  }

  function goToVideos() {
    localStorage.setItem("creatorboard_completed_days", JSON.stringify([1]));
    router.push("/videos");
  }

  return (
    <main className="wrap">

      {/* ── MBTI 유형 결과 ── */}
      {mbti && entry && (
        <section className="mbti-result-hero">
          <p className="eyebrow">진단 결과</p>
          <div className="mbti-type-badge">{mbti}</div>
          <h1 className="mbti-type-title">{entry.title}</h1>
          <p className="mbti-concept">&ldquo;{entry.concept}&rdquo;</p>

          <div className="mbti-detail-grid">
            <div className="mbti-detail-card mbti-detail-category">
              <span className="mbti-detail-label">추천 카테고리</span>
              <p>{entry.categories}</p>
            </div>
            <div className="mbti-detail-card">
              <span className="mbti-detail-label">잘 맞는 포맷</span>
              <p>{entry.formats}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── 저장 유도 배너 ── */}
      <div className="save-banner">
        <div className="save-banner-text">
          <strong>진단 결과를 저장하면 내일 다시 이어서 할 수 있어요.</strong>
          <span>{session ? "지금 진단 결과와 7일 실행 플랜을 보드에 저장합니다." : "Google 계정으로 로그인하면 결과가 보관됩니다."}</span>
        </div>
        <button
          className={`btn ${saveState === "saved" ? "btn-secondary" : "btn-primary"} save-banner-btn`}
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving" || saveState === "saved"}
        >
          {saveState === "saved" ? (
            <><Check size={16} /> 저장됨</>
          ) : saveState === "saving" ? (
            <><BookmarkPlus size={16} /> 저장 중</>
          ) : session ? (
            <><BookmarkPlus size={16} /> 저장하기</>
          ) : (
            <><LogIn size={16} /> Google로 로그인 후 저장</>
          )}
        </button>
      </div>

      {/* MBTI 없는 구버전 호환 */}
      {!mbti && (
        <section className="section-head">
          <div>
            <p className="eyebrow">진단 결과</p>
            <h1 style={{ fontSize: 46 }}>지금은 이 방향이 가장 찍기 쉽습니다.</h1>
            <p className="lead" style={{ maxWidth: "none" }}>7일 안에 첫 영상을 올릴 수 있는 현실적인 시작점을 찾았습니다.</p>
          </div>
        </section>
      )}

      {/* ── 추천 방향 요약 ── */}
      <section className="result-hero panel panel-pad">
        <div className="result-badge">
          <Target size={18} />
          추천 첫 주제 방향
        </div>
        <h2>
          {koreanCategory} 콘텐츠를 {diagnosis.interestTopic} 방식으로 풀어보세요.
        </h2>
        <div className="category-result">
          <span>추천 분류</span>
          <strong>{koreanCategory}</strong>
        </div>
        <p className="lead">
          첫 주제는 &ldquo;{firstKeyword}&rdquo; 방향이 좋습니다.<br />
          이미 겪은 일, 배운 것, 비교해본 것을 2분짜리 영상으로 작게 정리하세요.
        </p>
        <div className="result-summary-grid">
          <div>
            <span>추천 키워드</span>
            <strong>{displayKeywords[0] ?? firstKeyword}</strong>
          </div>
          <div>
            <span>첫 실행</span>
            <strong>프로필 설정</strong>
          </div>
          <div>
            <span>다음 단계</span>
            <strong>영상 3개 선택</strong>
          </div>
        </div>
      </section>

      {/* ── DAY 1 프로필 설정 ── */}
      <section className="panel panel-pad profile-guide">
        <div className="section-kicker">DAY 1</div>
        <h2>오늘 먼저 할 일: 프로필을 설정해보세요.</h2>
        <p className="lead" style={{ maxWidth: "none" }}>
          주제가 정해졌으면 주제에 맞는 채널명과 소개 문구, 프로필 이미지를 만들어 보세요.<br />
          완벽하게 만들 필요는 없습니다. 첫 영상을 올리다 보면 더 좋은 아이디어가 생기실 거예요.
        </p>
        <div className="prompt-box">
          <div className="prompt-head">
            <div>
              <p className="eyebrow">GPT에 복사해서 물어볼 문구</p>
              <p>아래 문구를 복사해서 GPT에 붙여넣고 프로필 아이디어를 추천받으세요.</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={copyPrompt}>
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "복사됨" : "복사"}
            </button>
          </div>
          <div className="prompt-copy">{profilePrompt}</div>
        </div>
        <div className="profile-guide-grid">
          <div className="profile-guide-item">
            <h3>채널명</h3>
            <p className="muted">{koreanCategory}{eul(koreanCategory)} 쉽게 시작하는 사람처럼 기억되는 짧은 이름을 씁니다.</p>
          </div>
          <div className="profile-guide-item">
            <h3>소개 문구</h3>
            <p className="muted">
              &ldquo;{diagnosis.interestTopic}{eul(diagnosis.interestTopic)} 처음 시작하는 사람에게, 직접 해본 방법을 쉽게 정리합니다.&rdquo;
            </p>
          </div>
          <div className="profile-guide-item">
            <h3>프로필 이미지</h3>
            <p className="muted">얼굴 사진이 부담되면 글자 로고, 심플한 아이콘, 밝은 배경의 대표 이미지를 씁니다.</p>
          </div>
        </div>
      </section>

      {/* ── 7일 실행 플랜 ── */}
      <section className="panel panel-pad plan-section">
        <div className="section-kicker">업로드까지 가는 흐름</div>
        <h2>7일 실행 플랜</h2>
        <div className="day-list">
          {sevenDayPlan.map((day) => (
            <div className={`day-card ${day.day === 1 ? "today" : ""}`} key={day.day}>
              <div className="day-card-head">
                <span className="num day-num">DAY {day.day}</span>
                <span className="day-status">{day.day === 1 ? "오늘 할 일" : "예정"}</span>
              </div>
              <div>
                <h3>{day.title}</h3>
                <p className="muted">{day.task}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="actions actions-end" style={{ marginBottom: 40 }}>
        <button className="btn btn-secondary" type="button" onClick={() => router.push("/diagnosis")}>
          다시 진단하기
        </button>
        <button className="btn btn-primary" type="button" onClick={goToVideos}>
          DAY 2 영상 후보 보기 <ArrowRight size={18} />
        </button>
      </div>

    </main>
  );
}

function eul(word: string): string {
  const last = word[word.length - 1];
  const code = last?.charCodeAt(0) ?? 0;
  if (code < 0xAC00 || code > 0xD7A3) return "을";
  return (code - 0xAC00) % 28 === 0 ? "를" : "을";
}

function createSevenDayPlan(category: string, interest: string, firstKeyword?: string) {
  const topic = firstKeyword ?? `${category} ${interest}`;
  return [
    { day: 1, title: "주제 확정과 유튜브 프로필 설정", task: `${topic}${eul(topic)} 바탕으로 첫 주제를 한 문장으로 정하고, 채널명/프로필 이미지/소개 문구를 임시로 설정합니다.` },
    { day: 2, title: "영상 3개 고르고 제목/썸네일 문구 확정하기", task: "다음 화면에서 영상 3개를 선택하고, 제목과 썸네일 문구를 조합해 각각 1개씩 고릅니다." },
    { day: 3, title: "썸네일 만들기", task: "미리캔버스 무료버전으로 썸네일을 만들고, 확정한 썸네일 문구를 넣습니다." },
    { day: 4, title: "2분 영상 구성안과 나레이션 녹음", task: "선택한 영상 3개를 참고해 2분 구성안을 만들고, 나레이션을 녹음합니다." },
    { day: 5, title: "스마트폰 촬영과 썸네일 사진 촬영", task: "구성안에 맞춰 필요한 장면을 촬영하고, 썸네일에 넣을 사진도 함께 촬영합니다." },
    { day: 6, title: "캡컷으로 편집하기", task: "나레이션 흐름에 맞춰 촬영 장면을 배치하고, 불필요한 침묵과 빈 화면을 잘라냅니다." },
    { day: 7, title: "설명란 작성, 업로드, 채널 확인", task: "최종 제목과 설명란을 작성하고 업로드한 뒤 정상 업로드됐는지 확인합니다." },
  ];
}
