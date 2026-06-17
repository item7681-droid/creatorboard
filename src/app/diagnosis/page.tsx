"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";

// ─── 타입 ────────────────────────────────────────────────

type Axis = "IE" | "SN" | "TF" | "JP";

type Question = {
  title: string;
  subtitle: string;
  axis?: Axis;            // 메인 16문항
  bonusField?: string;    // 보너스 4문항
  options: { label: string; value: string }[];
};

type Scores = {
  IE: { I: number; E: number };
  SN: { S: number; N: number };
  TF: { T: number; F: number };
  JP: { J: number; P: number };
};

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

// ─── 질문 데이터 ──────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AXIS_LABELS: Record<Axis, string> = {
  IE: "정보형 vs 경험형",
  SN: "실용형 vs 상상형",
  TF: "분석형 vs 공감형",
  JP: "기획형 vs 즉흥형",
};

const questions: Question[] = [
  // I / E 축
  {
    title: "영상을 만들 때 더 끌리는 방식은?",
    subtitle: "정보형 vs 경험형",
    axis: "IE",
    options: [
      { label: "특정 지식, 정보, 노하우를 정리해서 전달한다", value: "A" },
      { label: "내 경험, 감정, 일상, 리액션을 보여준다", value: "B" },
    ],
  },
  {
    title: "사람들이 내 영상을 보고 이렇게 느꼈으면 좋겠다.",
    subtitle: "정보형 vs 경험형",
    axis: "IE",
    options: [
      { label: "\"유익하다, 배웠다, 정리됐다\"", value: "A" },
      { label: "\"재밌다, 친근하다, 같이 있는 느낌이다\"", value: "B" },
    ],
  },
  {
    title: "내가 오래 할 수 있는 콘텐츠는?",
    subtitle: "정보형 vs 경험형",
    axis: "IE",
    options: [
      { label: "주제를 조사하고 정리해서 설명하는 콘텐츠", value: "A" },
      { label: "내 모습이나 상황을 자연스럽게 보여주는 콘텐츠", value: "B" },
    ],
  },
  {
    title: "촬영할 때 더 편한 것은?",
    subtitle: "정보형 vs 경험형",
    axis: "IE",
    options: [
      { label: "대본이나 자료를 기반으로 말하기", value: "A" },
      { label: "흐름에 따라 자연스럽게 말하기", value: "B" },
    ],
  },
  // S / N 축
  {
    title: "내가 좋아하는 영상은?",
    subtitle: "실용형 vs 상상형",
    axis: "SN",
    options: [
      { label: "현실에 바로 적용할 수 있는 팁, 리뷰, 튜토리얼", value: "A" },
      { label: "신선한 관점, 세계관, 기획, 스토리가 있는 영상", value: "B" },
    ],
  },
  {
    title: "콘텐츠 주제를 고를 때 더 중요한 것은?",
    subtitle: "실용형 vs 상상형",
    axis: "SN",
    options: [
      { label: "사람들이 실제로 자주 검색하고 필요로 하는가", value: "A" },
      { label: "남들이 잘 안 하는 새롭고 독특한 주제인가", value: "B" },
    ],
  },
  {
    title: "내 강점에 가까운 것은?",
    subtitle: "실용형 vs 상상형",
    axis: "SN",
    options: [
      { label: "구체적으로 비교하고 체험하고 정리하는 것", value: "A" },
      { label: "컨셉을 만들고 이야기를 확장하는 것", value: "B" },
    ],
  },
  {
    title: "영상 아이디어가 떠오를 때 보통은?",
    subtitle: "실용형 vs 상상형",
    axis: "SN",
    options: [
      { label: "생활 속 불편함, 제품, 장소, 방법에서 나온다", value: "A" },
      { label: "상상, 트렌드 해석, 캐릭터, 세계관에서 나온다", value: "B" },
    ],
  },
  // T / F 축
  {
    title: "내가 더 잘하는 설명 방식은?",
    subtitle: "분석형 vs 공감형",
    axis: "TF",
    options: [
      { label: "장단점, 기준, 순위, 근거를 들어 설명하기", value: "A" },
      { label: "느낌, 분위기, 경험, 공감을 중심으로 말하기", value: "B" },
    ],
  },
  {
    title: "댓글에서 더 듣고 싶은 말은?",
    subtitle: "분석형 vs 공감형",
    axis: "TF",
    options: [
      { label: "\"분석이 정확해요\", \"비교가 도움 됐어요\"", value: "A" },
      { label: "\"위로가 됐어요\", \"말투가 좋아요\", \"공감돼요\"", value: "B" },
    ],
  },
  {
    title: "콘텐츠를 고를 때 더 끌리는 방향은?",
    subtitle: "분석형 vs 공감형",
    axis: "TF",
    options: [
      { label: "정보의 정확성, 설득력, 판단 기준", value: "A" },
      { label: "감정의 전달, 분위기, 관계성", value: "B" },
    ],
  },
  {
    title: "내가 구독자를 모은다면 어떤 이미지가 좋을까?",
    subtitle: "분석형 vs 공감형",
    axis: "TF",
    options: [
      { label: "믿을 만한 전문가, 분석가, 리뷰어", value: "A" },
      { label: "편한 친구, 멘토, 감성적인 크리에이터", value: "B" },
    ],
  },
  // J / P 축
  {
    title: "영상 제작 방식으로 더 맞는 것은?",
    subtitle: "기획형 vs 즉흥형",
    axis: "JP",
    options: [
      { label: "시리즈, 코너, 업로드 루틴을 정해서 운영한다", value: "A" },
      { label: "그때그때 떠오르는 주제나 트렌드에 맞춰 만든다", value: "B" },
    ],
  },
  {
    title: "채널 운영에서 더 자신 있는 것은?",
    subtitle: "기획형 vs 즉흥형",
    axis: "JP",
    options: [
      { label: "일정표, 콘텐츠 캘린더, 반복 가능한 포맷 만들기", value: "A" },
      { label: "빠른 반응, 즉흥 기획, 유행 따라가기", value: "B" },
    ],
  },
  {
    title: "내가 선호하는 영상 구조는?",
    subtitle: "기획형 vs 즉흥형",
    axis: "JP",
    options: [
      { label: "도입-본론-정리 흐름이 명확한 영상", value: "A" },
      { label: "자연스러운 흐름과 예상 밖의 재미가 있는 영상", value: "B" },
    ],
  },
  {
    title: "장기적으로 더 해보고 싶은 채널은?",
    subtitle: "기획형 vs 즉흥형",
    axis: "JP",
    options: [
      { label: "브랜드처럼 정돈된 전문 채널", value: "A" },
      { label: "개성이 살아있는 자유로운 채널", value: "B" },
    ],
  },
  // ── 보너스 4문항 ──
  {
    title: "카메라에 내 얼굴이 나오는 것은?",
    subtitle: "최종 카테고리를 좁히는 질문입니다.",
    bonusField: "facePreference",
    options: [
      { label: "가능하다 — 브이로그, 토크, 인터뷰, 리액션이 잘 맞아", value: "얼굴 출연 가능" },
      { label: "어렵다 — 정보형, 리뷰형, 화면녹화, 내레이션이 더 편해", value: "얼굴 없이 하고 싶다" },
    ],
  },
  {
    title: "촬영보다 편집이 더 좋은가?",
    subtitle: "최종 카테고리를 좁히는 질문입니다.",
    bonusField: "editPref",
    options: [
      { label: "촬영이 좋다 — 일상, 체험, 여행, 먹방", value: "촬영" },
      { label: "편집이 좋다 — 해설, 분석, 쇼츠, 에세이", value: "편집" },
    ],
  },
  {
    title: "전문성이 있는 분야가 있는가?",
    subtitle: "최종 카테고리를 좁히는 질문입니다.",
    bonusField: "expertise",
    options: [
      { label: "있다 — 교육, 리뷰, 커리어, 재테크, 비즈니스", value: "있다" },
      { label: "없다 — 일상, 취향 큐레이션, 챌린지, 트렌드 반응", value: "없다" },
    ],
  },
  {
    title: "오래 지속 가능한 주제는?",
    subtitle: "최종 카테고리를 좁히는 질문입니다.",
    bonusField: "sustainable",
    options: [
      { label: "내가 이미 자주 하는 것", value: "이미 하는 것" },
      { label: "내가 계속 배우고 싶은 것", value: "배우고 싶은 것" },
      { label: "사람들이 자주 물어보는 것", value: "자주 물어보는 것" },
      { label: "내가 말할 때 에너지가 나는 것", value: "에너지가 나는 것" },
    ],
  },
];

// ─── MBTI 결과 테이블 ─────────────────────────────────────

const MBTI_TABLE: Record<string, MBTIEntry> = {
  ISTJ: {
    title: "체계적인 정보·리뷰형",
    categories: "제품 리뷰, 사용법, 비교 분석, 선택 기준, 생활 도구",
    formats: '"OO 비교해봤습니다" / "초보자를 위한 정리" / "실패 없는 선택 기준"',
    concept: "꼼꼼하게 분석하고 정리해주는 신뢰형 채널",
    firstVideo: "내가 써본 제품 3가지 직접 비교",
    categoryId: "26", knownField: "Howto & Style", interestTopic: "제품/서비스 비교",
  },
  ISFJ: {
    title: "친절한 생활정보·루틴형",
    categories: "일상 루틴, 살림 기록, 다이어리, 요리 일상, 공부 브이로그",
    formats: '"하루 루틴" / "초보도 따라 하는 OO" / "조용하지만 알찬 일상"',
    concept: "현실적인 일상을 따뜻하게 정리해주는 채널",
    firstVideo: "아침 루틴 30분 — 내가 매일 지키는 것들",
    categoryId: "22", knownField: "People & Blogs", interestTopic: "루틴과 습관",
  },
  INFJ: {
    title: "메시지 중심 감성·에세이형",
    categories: "감정 기록, 인간관계, 자기이해, 감성 브이로그, 독서 일상",
    formats: '"혼자 있는 시간이 필요한 이유" / "관계에서 지치지 않는 법"',
    concept: "조용하지만 깊이 있는 메시지가 남는 채널",
    firstVideo: "요즘 나를 위로해준 문장 5개",
    categoryId: "22", knownField: "People & Blogs", interestTopic: "성장 기록",
  },
  INTJ: {
    title: "전략형 지식·분석 채널",
    categories: "AI 활용, 기술 트렌드, 생산성 도구, 데이터 분석, 미래 변화",
    formats: '"앞으로 뜰 시장 분석" / "OO가 성공한 이유" / "이 산업의 변화"',
    concept: "흐름을 읽고 전략을 설계해주는 분석형 채널",
    firstVideo: "지금 시작하면 늦지 않은 유튜브 분야 3가지",
    categoryId: "28", knownField: "Science & Technology", interestTopic: "트렌드 해석",
  },
  ISTP: {
    title: "실전형 체험·테스트 채널",
    categories: "기기 테스트, 장비 사용법, DIY 실험, 앱 활용, 도구 리뷰",
    formats: '"직접 써봤습니다" / "진짜 되는지 테스트" / "가성비 장비 비교"',
    concept: "직접 해보고 결과만 보여주는 실전형 채널",
    firstVideo: "5만 원짜리 장비로 유튜브 시작해봤습니다",
    categoryId: "28", knownField: "Science & Technology", interestTopic: "도구 사용법",
  },
  ISFP: {
    title: "감성 브이로그·취향 큐레이션형",
    categories: "일상 브이로그, 카페 기록, 감성 소품, 취향 공유, 혼자 보내는 시간",
    formats: '"요즘 좋아하는 것들" / "혼자 보내는 주말" / "감성 여행 기록"',
    concept: "나만의 취향과 감성을 담담하게 보여주는 채널",
    firstVideo: "요즘 나를 행복하게 해주는 것들",
    categoryId: "22", knownField: "People & Blogs", interestTopic: "취향 공유",
  },
  INFP: {
    title: "스토리텔링·취향 세계관형",
    categories: "영화 이야기, 음악 추천, 취향 큐레이션, 감성 콘텐츠, 가벼운 리뷰",
    formats: '"내가 이 영화를 좋아하는 이유" / "조용히 위로가 되는 이야기"',
    concept: "조용하지만 깊이 있는 취향 기록 채널",
    firstVideo: "나를 바꾼 책 한 권 — 솔직한 리뷰",
    categoryId: "24", knownField: "Entertainment", interestTopic: "가벼운 재미",
  },
  INTP: {
    title: "지적 탐구·해설형",
    categories: "쉬운 지식, 역사 해설, 과학 상식, IT 입문, 개념 설명",
    formats: '"왜 이런 현상이 생길까?" / "OO의 원리" / "알고 보면 무서운 사실"',
    concept: "궁금증을 끝까지 파고드는 지식 탐구 채널",
    firstVideo: "AI가 크리에이터를 대체할 수 없는 진짜 이유",
    categoryId: "27", knownField: "Education", interestTopic: "쉬운 설명",
  },
  ESTP: {
    title: "액션·도전·리액션형",
    categories: "챌린지, 리액션, 거리 인터뷰, 체험 콘텐츠, 예능형 실험",
    formats: '"OO 해보기" / "즉석 인터뷰" / "처음 가본 곳에서 하루 보내기"',
    concept: "일단 해보고 반응을 보여주는 에너지 넘치는 채널",
    firstVideo: "처음 해보는 OO — 리얼 반응 모음",
    categoryId: "24", knownField: "Entertainment", interestTopic: "반응 콘텐츠",
  },
  ESFP: {
    title: "엔터테인먼트·라이프스타일형",
    categories: "일상 예능, 리액션, 쇼츠, 먹방, 라이프스타일 체험",
    formats: '"친구랑 하루 보내기" / "요즘 유행템 리뷰" / "리얼 반응 모음"',
    concept: "보는 것만으로도 에너지가 채워지는 라이프스타일 채널",
    firstVideo: "요즘 제일 핫한 거 다 사봤습니다",
    categoryId: "24", knownField: "Entertainment", interestTopic: "가벼운 재미",
  },
  ENFP: {
    title: "아이디어·소통·트렌드형",
    categories: "트렌드 토크, 인터뷰, 밈 리뷰, 관계 이야기, 소통형 콘텐츠",
    formats: '"요즘 사람들이 OO에 빠지는 이유" / "구독자 고민 상담"',
    concept: "새로운 아이디어와 사람 이야기로 채워지는 소통형 채널",
    firstVideo: "요즘 MZ가 유튜브 대신 하는 것들",
    categoryId: "24", knownField: "Entertainment", interestTopic: "트렌드 해석",
  },
  ENTP: {
    title: "논쟁·실험·기획형",
    categories: "사회 이슈, 뉴스 해석, 토론, 트렌드 비평, 논쟁형 콘텐츠",
    formats: '"정말 그럴까?" / "반대로 해봤습니다" / "논란의 OO 분석"',
    concept: "뻔한 주제를 다르게 뒤집어보는 채널",
    firstVideo: "유튜브에서 절대 하면 안 된다는 것들 다 해봤습니다",
    categoryId: "25", knownField: "News & Politics", interestTopic: "이슈 정리",
  },
  ESTJ: {
    title: "성과 중심 실용·전문 채널",
    categories: "업무법, 자기관리, 공부법, 생산성 루틴, 실용 노하우",
    formats: '"성과 내는 법" / "시간 낭비 줄이는 루틴" / "직장인 필수 스킬"',
    concept: "결과로 증명하는 실용적인 성장 채널",
    firstVideo: "직장인이 부업 시작하기 전에 알아야 할 것들",
    categoryId: "26", knownField: "Howto & Style", interestTopic: "수익형 콘텐츠",
  },
  ESFJ: {
    title: "관계·생활·공감형 채널",
    categories: "일상 브이로그, 가족 이야기, 요리 일상, 관계 공감, 생활 기록",
    formats: '"사람들이 좋아하는 말투" / "친구와 대화하기" / "따뜻한 집밥 브이로그"',
    concept: "따뜻한 공감과 현실 이야기로 가득한 채널",
    firstVideo: "자취방에서 혼자 해먹는 현실 밥상",
    categoryId: "22", knownField: "People & Blogs", interestTopic: "일상 기록",
  },
  ENFJ: {
    title: "멘토형 성장·커뮤니티 채널",
    categories: "성장 습관, 공부법, 동기부여, 커리어 조언, 쉬운 강연",
    formats: '"나를 바꾸는 습관" / "20대에게 해주고 싶은 말" / "구독자 고민 상담"',
    concept: "변화를 원하는 사람들의 나침반이 되는 채널",
    firstVideo: "지금 당장 바꿀 수 있는 아침 습관 3가지",
    categoryId: "27", knownField: "Education", interestTopic: "성장 기록",
  },
  ENTJ: {
    title: "비즈니스·전략·리더십형",
    categories: "기술 트렌드, AI 비즈니스, 생산성 시스템, 시장 분석, 전략 도구",
    formats: '"성공하는 사람들의 전략" / "돈 되는 시장 분석" / "사업 아이디어 검증"',
    concept: "돈과 기회를 보는 눈을 키워주는 전략 채널",
    firstVideo: "0원으로 시작할 수 있는 1인 사업 아이디어 5가지",
    categoryId: "28", knownField: "Science & Technology", interestTopic: "트렌드 해석",
  },
};

// ─── 점수 계산 ────────────────────────────────────────────

function calcMBTI(answers: Record<number, string>): string {
  const scores: Scores = {
    IE: { I: 0, E: 0 },
    SN: { S: 0, N: 0 },
    TF: { T: 0, F: 0 },
    JP: { J: 0, P: 0 },
  };

  questions.forEach((q, i) => {
    if (!q.axis) return;
    const val = answers[i];
    if (!val) return;
    const axisKeys: Record<Axis, [string, string]> = {
      IE: ["I", "E"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"],
    };
    const [a, b] = axisKeys[q.axis];
    if (val === "A") (scores[q.axis] as Record<string, number>)[a]++;
    else (scores[q.axis] as Record<string, number>)[b]++;
  });

  const i = scores.IE.I >= scores.IE.E ? "I" : "E";
  const s = scores.SN.S >= scores.SN.N ? "S" : "N";
  const t = scores.TF.T >= scores.TF.F ? "T" : "F";
  const j = scores.JP.J >= scores.JP.P ? "J" : "P";
  return `${i}${s}${t}${j}`;
}

// ─── 컴포넌트 ─────────────────────────────────────────────

const MAIN_COUNT = 16;
const TOTAL = questions.length; // 20

export default function DiagnosisPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selecting, setSelecting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[step];
  const isBonus = step >= MAIN_COUNT;
  const isLast = step === TOTAL - 1;
  const progress = (step / TOTAL) * 100;

  function handleSelect(value: string) {
    if (selecting) return;
    setSelecting(value);
    setAnswers((prev) => ({ ...prev, [step]: value }));

    setTimeout(() => {
      setSelecting(null);
      if (!isLast) setStep((s) => s + 1);
    }, 360);
  }

  async function submit() {
    setLoading(true);
    const mbtiType = calcMBTI(answers);
    const entry = MBTI_TABLE[mbtiType] ?? MBTI_TABLE["ISFJ"];

    const bonusFace = answers[16] ?? "얼굴 없이 하고 싶다";
    const bonusTime = answers[17] === "촬영" ? "2~3시간" : "1~2시간";

    const payload = {
      reason: "부수익을 만들고 싶다",
      expectedResult: "월 10만~50만 원 수익",
      knownField: entry.knownField,
      categoryId: entry.categoryId,
      interestTopic: entry.interestTopic,
      facePreference: bonusFace,
      availableTime: bonusTime,
      avoidTopic: "",
      shootingBurden: 3,
    };

    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = response.ok ? await response.json() : {};
      localStorage.setItem(
        "creatorboard_diagnosis",
        JSON.stringify({ ...payload, ...data, mbtiType, mbtiEntry: entry, answers, categoryId: entry.categoryId })
      );
    } catch {
      const now = Date.now();
      localStorage.setItem(
        "creatorboard_diagnosis",
        JSON.stringify({
          ...payload,
          mbtiType,
          mbtiEntry: entry,
          answers,
          diagnosisId: `demo-${now}`,
          generationSessionId: `demo-session-${now}`,
          recommendedKeywords: [
            `${entry.interestTopic} 초보 영상`,
            `${entry.interestTopic} 시작 방법`,
            `${entry.interestTopic} 체크리스트`,
            `${entry.interestTopic} 수익형 콘텐츠`,
            `${entry.firstVideo}`,
          ],
          demoMode: true,
        })
      );
    } finally {
      setLoading(false);
    }

    router.push("/diagnosis/result");
  }

  const cols = currentQuestion.options.length === 4 ? "2" : "1";

  return (
    <main className="wrap">
      {/* 진행 바 */}
      <div className="diag-progress-bar">
        <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* 헤더 */}
      <div className="diag-header">
        {step > 0 ? (
          <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft size={16} /> 이전
          </button>
        ) : (
          <span />
        )}
        <div className="diag-header-right">
          {isBonus && <span className="diag-bonus-badge">보너스 {step - MAIN_COUNT + 1}/4</span>}
          <span className="diag-counter">{step + 1} / {TOTAL}</span>
        </div>
      </div>

      {/* 질문 */}
      <section className="diag-step">
        <p className="diag-subtitle">{currentQuestion.subtitle}</p>
        <h2 className="diag-question">{currentQuestion.title}</h2>

        <div className={`diag-options diag-options-${cols}`}>
          {currentQuestion.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`diag-option${answers[step] === opt.value ? " selected" : ""}${selecting === opt.value ? " selecting" : ""}`}
              onClick={() => handleSelect(opt.value)}
              disabled={!!selecting}
            >
              {!isBonus && opt.value === "A" && <span className="diag-ab-tag">A</span>}
              {!isBonus && opt.value === "B" && <span className="diag-ab-tag">B</span>}
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* 제출 버튼 (마지막 문항 답 선택 후) */}
      {isLast && answers[step] && (
        <div className="diag-submit">
          <button
            className="btn btn-primary btn-large"
            type="button"
            onClick={submit}
            disabled={loading}
          >
            <ClipboardList size={18} />
            {loading ? "유형 분석 중..." : "내 유튜브 유형 보기"}
          </button>
        </div>
      )}
    </main>
  );
}
