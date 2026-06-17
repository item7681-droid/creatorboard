export type MBTIEntry = {
  title: string;
  categories: string;
  formats: string;
  concept: string;
  firstVideo: string;
  categoryId: string;
  knownField: string;
  interestTopic: string;
};

export const MBTI_TABLE: Record<string, MBTIEntry> = {
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

/** knownField + interestTopic 조합으로 추천 카테고리 문자열 반환 */
export function getCategoriesByTopics(knownField: string, interestTopic: string): string | null {
  const entry = Object.values(MBTI_TABLE).find(
    (e) => e.knownField === knownField && e.interestTopic === interestTopic
  );
  return entry?.categories ?? null;
}
