// MBTI 축별 콘텐츠 수식어
const EI_MOD: Record<string, string> = {
  E: "브이로그",
  I: "혼자 제작",
};
const NS_MOD: Record<string, string> = {
  N: "요즘 뜨는",
  S: "실전",
};
const TF_MOD: Record<string, string> = {
  T: "성과 분석",
  F: "공감 후기",
};
const JP_MOD: Record<string, string> = {
  J: "단계별",
  P: "다양하게",
};

// 검색 의도 6가지 템플릿
const INTENTS: Array<(kw: string) => string> = [
  (kw) => `${kw} 월 수익 공개`,        // ① 수익/성과
  (kw) => `${kw} 조회수 폭발한`,       // ② 성장 과정
  (kw) => `${kw} 콘텐츠 아이디어`,    // ③ 기획/주제
  (kw) => `${kw} 혼자 찍는 법`,        // ④ 제작 노하우
  (kw) => `요즘 뜨는 ${kw}`,           // ⑤ 트렌드
  (kw) => `${kw} 성공 채널 공통점`,   // ⑥ 비교/분석
];

/**
 * MBTI + 추천 카테고리 목록 + 관심주제 조합으로 추천 키워드 5개 생성
 * categoryPool: MBTI_TABLE[mbtiType].categories.split(", ") 로 전달
 */
export function buildKeywordsFromMBTI(
  mbtiType: string,
  categoryPool: string[],
  interestTopic?: string
): string[] {
  const e = mbtiType[0] ?? "I";
  const n = mbtiType[1] ?? "S";
  const t = mbtiType[2] ?? "T";
  const j = mbtiType[3] ?? "J";

  const pool = categoryPool.length > 0 ? categoryPool : ["콘텐츠"];
  const kw0 = pool[0] ?? "콘텐츠";
  const kw1 = pool[1] ?? kw0;
  const kw2 = pool[2] ?? kw0;

  const eiMod = EI_MOD[e] ?? "";
  const nsMod = NS_MOD[n] ?? "";
  const tfMod = TF_MOD[t] ?? "";
  const jpMod = JP_MOD[j] ?? "";

  const topicKw = interestTopic ?? kw0;

  return [
    INTENTS[0](`${nsMod} ${kw0}`.trim()),       // ① 수익 + N/S 수식어
    INTENTS[1](`${eiMod} ${kw1}`.trim()),       // ② 성장 + E/I 수식어
    INTENTS[2](`${tfMod} ${topicKw}`.trim()),   // ③ 기획 아이디어 + T/F + 주제
    INTENTS[4](`${jpMod} ${kw2}`.trim()),       // ⑤ 트렌드 + J/P 수식어
    INTENTS[5](kw1),                            // ⑥ 비교/분석
  ];
}
