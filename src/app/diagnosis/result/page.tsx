"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, ExternalLink, Target, BookmarkPlus, LogIn } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { cacheCompletedDay, markCompletedDay } from "@/lib/flow/progress";
import { getCategoryLabel } from "@/lib/youtube/categories";

type ProfileEntry = {
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
  mbtiEntry?: ProfileEntry;
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
      if (typeof data.progress?.completedDay === "number") {
        cacheCompletedDay(data.progress.completedDay);
      }
      setDiagnosis(data.diagnosis);
    }

    loadDiagnosis();
  }, [router]);

  if (!diagnosis) {
    return <main className="wrap"><div className="panel panel-pad">진단 결과를 불러오는 중입니다.</div></main>;
  }

  const entry = diagnosis.mbtiEntry;
  const koreanCategory = getCategoryLabel(diagnosis.categoryId, diagnosis.knownField);
  const displayKeywords = diagnosis.recommendedKeywords ?? [];
  const firstKeyword = entry?.firstVideo ?? displayKeywords[0] ?? `${koreanCategory} 첫 영상`;
  const sevenDayPlan = createSevenDayPlan(koreanCategory, diagnosis.interestTopic, firstKeyword);

  const profilePrompt = `당신은 세계 최고 수준의 유튜브 채널 브랜딩 전략가이자 마케팅 전문가입니다.

나는 유튜브를 처음 시작하는 초보 크리에이터입니다.${entry ? `\n콘텐츠 유형: ${entry.title}` : ""}
채널 주제: "${firstKeyword}"
콘텐츠 방향: ${koreanCategory}
스타일: 전문가처럼 보이기보다 처음 시작하는 사람이 꾸준히 운영할 수 있는 친근한 느낌

다음 항목을 구체적으로 컨설팅해주세요.

1. 채널명 5개 — 짧고 기억하기 쉬운 이름, 각 이름에 선택 이유 한 줄 포함
2. 채널 핸들 5개 — @로 시작하는 영문/한글 핸들, 채널명과 연결되는 것으로
3. 채널 설명 2개 — 시청자가 구독 버튼을 누르고 싶어지는 소개 문구 (3~4문장)
4. 프로필 사진 아이디어 3개 — 얼굴이 부담스러운 경우도 포함해서 제안
5. 배너 이미지 아이디어 3개 — 채널의 분위기와 주제가 한눈에 보이는 구성 제안`;

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
        memo: profilePrompt,
        completedDay: 1
      })
    });

    if (!response.ok) {
      setSaveState("idle");
      alert("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setSaveState("saved");
    cacheCompletedDay(1);
  }

  async function goToVideos() {
    if (!diagnosis) return;
    await markCompletedDay(1, diagnosis.generationSessionId);
    router.push("/videos");
  }

  return (
    <main className="wrap">

      {/* ── 유형 결과 ── */}
      {entry && (
        <section className="mbti-result-hero">
          <p className="eyebrow">진단 결과</p>
          <h1 className="mbti-type-title">{entry.title}</h1>
          <p className="mbti-concept">&ldquo;{entry.concept}&rdquo;</p>

          <div className="mbti-detail-grid">
            <div className="mbti-detail-card mbti-detail-category">
              <span className="mbti-detail-label">추천 카테고리</span>
              <p>{entry.categories}</p>
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

      {/* 구버전 호환 */}
      {!entry && (
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
          <span>대표 분류</span>
          <strong>{koreanCategory}</strong>
        </div>

        {displayKeywords.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
              영상 검색에 사용되는 추천 키워드
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {displayKeywords.map((kw, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "var(--panel-2)",
                    border: "1px solid var(--line)",
                    fontSize: "0.875rem",
                    lineHeight: 1.4,
                    color: "var(--text)",
                  }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── 벤치마킹 채널 탐색 ── */}
      {entry && (
        <section className="panel panel-pad">
          <p className="eyebrow">레퍼런스 채널 탐색</p>
          <h2>이런 채널들을 벤치마킹해보세요</h2>
          <p className="lead" style={{ maxWidth: "none", marginBottom: 20 }}>
            아래 키워드로 유튜브를 검색해 비슷한 방향의 채널 3개를 골라보세요.<br />
            제목 구성·썸네일 스타일·업로드 주기를 분석하면 첫 영상 기획이 훨씬 쉬워집니다.
          </p>
          <div className="benchmark-grid">
            {entry.categories.split(/,\s*/).map((cat, i) => (
              <a
                key={i}
                className="benchmark-card"
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(cat)}`}
                target="_blank"
                rel="noreferrer"
              >
                <span>{cat}</span>
                <ExternalLink size={14} />
              </a>
            ))}
          </div>
          <p style={{ marginTop: 16, color: "var(--amber)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            💡 구독자 1만 미만 채널도 꼭 확인하세요. 조회수가 높은 영상 패턴이 지금 시작하기에 가장 현실적인 레퍼런스입니다.
          </p>
        </section>
      )}

      {/* ── DAY 1 프로필 설정 ── */}
      <section className="panel panel-pad profile-guide">
        <div className="section-kicker">DAY 1</div>
        <h2>오늘 먼저 할 일: <span style={{ color: "var(--mint)" }}>프로필</span>을 설정해보세요.</h2>
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
        <p style={{ marginTop: 12, color: "var(--amber)", fontSize: "0.875rem", lineHeight: 1.6 }}>
          💡 GPT 답변을 받은 뒤, YouTube 사이트 접속 → 오른쪽 상단 아이콘 클릭 → 내 채널 보기 → 채널 맞춤설정에서 채널명·핸들·설명·프로필 사진·배너를 직접 설정할 수 있습니다.
        </p>
        <div className="profile-guide-grid">
          <div className="profile-guide-item">
            <h3>채널명 &amp; 핸들</h3>
            <p className="muted">짧고 기억하기 쉬운 이름을 고르고, @핸들은 채널명과 연결되는 영문으로 설정합니다.</p>
          </div>
          <div className="profile-guide-item">
            <h3>채널 설명</h3>
            <p className="muted">
              누가 왜 구독해야 하는지 3~4문장으로 씁니다. 첫 문장에 채널 주제와 타겟을 명확히 넣으세요.
            </p>
          </div>
          <div className="profile-guide-item">
            <h3>프로필 사진</h3>
            <p className="muted">얼굴이 부담되면 글자 로고, 심플한 아이콘, 밝은 배경의 대표 이미지를 씁니다.</p>
          </div>
          <div className="profile-guide-item">
            <h3>배너 이미지</h3>
            <p className="muted">채널 주제와 업로드 주기를 한눈에 보여주는 배너로 첫인상을 잡습니다. 미리캔버스 무료 템플릿으로 직접 만들 수 있습니다.</p>
            <a className="inline-link" href="https://www.miricanvas.com" target="_blank" rel="noreferrer">
              미리캔버스 무료 템플릿 <ExternalLink size={14} />
            </a>
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
