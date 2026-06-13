import type { VideoCandidate } from "@/lib/youtube/types";
import { getCategoryLabel } from "@/lib/youtube/categories";

export type GeneratedPlan = {
  titleCandidates: string[];
  thumbnailCandidates: string[];
  videoOutline: string[];
  sevenDayPlan: Array<{ day: number; title: string; task: string }>;
};

export function recommendKeywords(input: {
  knownField: string;
  interestTopic: string;
  categoryId?: string;
}) {
  const field = normalize(getCategoryLabel(input.categoryId, input.knownField)) || "초보 유튜브";
  const interest = normalize(input.interestTopic) || "경험담";
  const fieldParticle = withDirectionParticle(field);
  const interestParticle = withDirectionParticle(interest);
  return [
    `${fieldParticle} 월 10만원 벌기`,
    `${field} 초보가 시작하는 방법`,
    `${field} ${interest} 콘텐츠`,
    `얼굴 없이 하는 ${field} 유튜브`,
    `${interestParticle} 첫 영상 만들기`
  ];
}

export function generateProfitTemplate(videos: VideoCandidate[]): GeneratedPlan {
  const seed = videos[0]?.keyword ?? "부수익";
  const hooks = videos.map((video) => getHook(video.title)).filter(Boolean).slice(0, 3);
  const mainHook = hooks[0] ?? "초보가 바로 시작하는 방법";

  return {
    titleCandidates: [
      `${seed} 초보가 첫 영상으로 시작하기 좋은 주제 3가지`,
      `월 10만원을 목표로 ${seed} 콘텐츠를 고르는 방법`,
      `${mainHook}: 첫 영상은 이렇게 정하면 됩니다`,
      `얼굴 없이 가능한 ${seed} 첫 영상 아이디어`,
      `오늘 바로 찍을 수 있는 ${seed} 2분 영상 구성`
    ],
    thumbnailCandidates: [
      "첫 영상, 이걸로 시작",
      "월 10만원 목표",
      "얼굴 없이 가능",
      "오늘 바로 찍기",
      "주제 고민 끝"
    ],
    videoOutline: [
      "오프닝 15초: 오늘 다룰 문제와 시청자가 얻을 점을 바로 말한다.",
      "파트 1 35초: 선택한 뜨는 영상 3개의 공통 제목/썸네일 포인트를 한 문장으로 정리한다.",
      "파트 2 45초: 내 상황에 맞게 직접 해본 방법이나 준비 과정을 설명한다.",
      "파트 3 20초: 초보자가 따라 할 수 있는 핵심 행동 1가지를 보여준다.",
      "마무리 5초: 다음에 해볼 일과 채널에서 이어갈 주제를 짧게 남긴다."
    ],
    sevenDayPlan: [
      { day: 1, title: "주제 확정과 유튜브 프로필 설정", task: "진단 결과로 추천 주제와 키워드를 정하고 채널명, 소개 문구, 프로필 이미지를 임시로 설정한다." },
      { day: 2, title: "영상 3개 선택과 문구 확정", task: "마음에 드는 뜨는 영상 3개를 선택하고 제목 5개, 썸네일 문구 5개 중 각각 1개를 고른다." },
      { day: 3, title: "썸네일 만들기", task: "미리캔버스 무료버전으로 썸네일을 만들고, 문구 주변 빈 공간에 넣을 사진 구성을 정한다." },
      { day: 4, title: "2분 구성안과 나레이션 녹음", task: "선택한 3개 영상의 제목, 썸네일, 초반 흐름을 참고해 2분 구성안을 만들고 나레이션을 녹음한다." },
      { day: 5, title: "스마트폰 촬영", task: "2분 구성안에 맞춰 필요한 장면과 썸네일 사진을 스마트폰으로 촬영한다." },
      { day: 6, title: "캡컷 편집", task: "캡컷에서 나레이션 흐름에 맞게 장면을 배치하고 불필요한 구간을 자른다." },
      { day: 7, title: "업로드와 채널 확인", task: "핵심 키워드를 설명란에 자연스럽게 넣고 업로드한 뒤 채널에서 정상 업로드를 확인한다." }
    ]
  };
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

function getHook(title: string) {
  return title.split(/[|:,-]/)[0]?.trim();
}

function withDirectionParticle(value: string) {
  const lastChar = value.trim().at(-1);
  if (!lastChar) return value;

  const code = lastChar.charCodeAt(0);
  const hangulStart = 0xac00;
  const hangulEnd = 0xd7a3;

  if (code < hangulStart || code > hangulEnd) {
    return `${value}로`;
  }

  const hasFinalConsonant = (code - hangulStart) % 28 !== 0;
  return `${value}${hasFinalConsonant ? "으로" : "로"}`;
}
