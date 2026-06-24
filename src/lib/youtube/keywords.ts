const NS_MOD: Record<string, string> = {
  N: "트렌드",
  S: "실전",
};
const TF_MOD: Record<string, string> = {
  T: "비교 분석",
  F: "후기",
};
const JP_MOD: Record<string, string> = {
  J: "루틴",
  P: "아이디어",
};

/**
 * 성향 코드 + 추천 카테고리 목록 + 관심주제를 YouTube 검색용 짧은 타겟 키워드로 변환.
 */
export function buildKeywordsFromProfile(
  profileCode: string,
  categoryPool: string[],
  interestTopic?: string
): string[] {
  const n = profileCode[1] ?? "S";
  const t = profileCode[2] ?? "T";
  const j = profileCode[3] ?? "J";

  const pool = categoryPool.length > 0 ? categoryPool : ["콘텐츠"];
  const kw0 = pool[0] ?? "콘텐츠";
  const kw1 = pool[1] ?? kw0;
  const kw2 = pool[2] ?? kw0;

  const nsMod = NS_MOD[n] ?? "";
  const tfMod = TF_MOD[t] ?? "";
  const jpMod = JP_MOD[j] ?? "";

  const topicKw = interestTopic ?? kw0;

  const candidates = [
    `${topicKw} 유튜브`,
    `${kw0} ${tfMod}`.trim(),
    `${kw1} 브이로그`.trim(),
    `${kw2} ${nsMod}`.trim(),
    `${topicKw} ${jpMod}`.trim(),
  ];

  return Array.from(new Set(candidates.map(normalizeSearchKeyword).filter((keyword) => keyword.length >= 2))).slice(0, 5);
}

function normalizeSearchKeyword(keyword: string) {
  return keyword
    .replace(/[/"'“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 4)
    .join(" ");
}
