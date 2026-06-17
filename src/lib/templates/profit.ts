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
  const field = normalize(getCategoryLabel(input.categoryId, input.knownField)) || "\uCD08\uBCF4 \uC720\uD29C\uBE0C";
  const interest = normalize(input.interestTopic) || "\uACBD\uD5D8\uB2F4";
  const fieldParticle = withDirectionParticle(field);
  const interestParticle = withDirectionParticle(interest);
  return [
    `${fieldParticle} \uC6D4 10\uB9CC\uC6D0 \uBC8C\uAE30`,
    `${field} \uCD08\uBCF4\uAC00 \uC2DC\uC791\uD558\uB294 \uBC29\uBC95`,
    `${field} ${interest} \uCF58\uD150\uCE20`,
    `\uC5BC\uAD74 \uC5C6\uC774 \uD558\uB294 ${field} \uC720\uD29C\uBE0C`,
    `${interestParticle} \uCCAB \uC601\uC0C1 \uB9CC\uB4E4\uAE30`
  ];
}

export function generateProfitTemplate(videos: VideoCandidate[]): GeneratedPlan {
  // keyword \uD544\uB4DC\uB294 "keyword::category:123" \uD615\uC2DD\uC77C \uC218 \uC788\uC73C\uBBC0\uB85C \uC55E\uBD80\uBD84\uB9CC \uC0AC\uC6A9
  const rawKeyword = videos[0]?.keyword ?? "\uBD80\uC218\uC775";
  const seed = rawKeyword.split("::")[0].trim() || "\uBD80\uC218\uC775";

  const hooks = videos.map((v) => getHook(v.title)).filter((h): h is string => Boolean(h));
  const [hook1, hook2, hook3] = hooks;
  const mainHook = hook1 ?? "\uCD08\uBCF4\uAC00 \uBC14\uB85C \uC2DC\uC791\uD558\uB294 \uBC29\uBC95";

  const numericThumbs = videos
    .map((v) => extractNumericThumb(v.title))
    .filter((t): t is string => Boolean(t));

  const thumbFallbacks = [
    toShortThumb(hook1) ?? "\uCCAB \uC601\uC0C1, \uC774\uAC78\uB85C",
    toShortThumb(hook2) ?? "\uC6D4 10\uB9CC\uC6D0 \uBAA9\uD45C",
    toShortThumb(hook3) ?? "\uC5BC\uAD74 \uC5C6\uC774 \uAC00\uB2A5",
    "\uC624\uB298 \uBC14\uB85C \uCC0D\uAE30",
    "\uC8FC\uC81C \uACE0\uBBFC \uB05D"
  ];

  const thumbPool = [...numericThumbs, ...thumbFallbacks];
  const thumbnailCandidates = dedup(thumbPool).slice(0, 5);

  const thumbDefaults = [
    "\uCCAB \uC601\uC0C1, \uC774\uAC78\uB85C",
    "\uC6D4 10\uB9CC\uC6D0 \uBAA9\uD45C",
    "\uC5BC\uAD74 \uC5C6\uC774 \uAC00\uB2A5",
    "\uC624\uB298 \uBC14\uB85C \uCC0D\uAE30",
    "\uC8FC\uC81C \uACE0\uBBFC \uB05D"
  ];
  while (thumbnailCandidates.length < 5) {
    const next = thumbDefaults[thumbnailCandidates.length];
    if (next && !thumbnailCandidates.includes(next)) {
      thumbnailCandidates.push(next);
    } else {
      thumbnailCandidates.push(`\uD6C4\uBCF4 ${thumbnailCandidates.length + 1}`);
    }
  }

  return {
    titleCandidates: [
      `${mainHook} | ${seed} \uCCAB \uC601\uC0C1 \uB9CC\uB4DC\uB294 \uBC29\uBC95`,
      `\uC6D4 10\uB9CC\uC6D0\uC744 \uBAA9\uD45C\uB85C ${seed} \uCF58\uD150\uCE20\uB97C \uACE0\uB974\uB294 \uBC29\uBC95`,
      hook2
        ? `${hook2}: \uC5BC\uAD74 \uC5C6\uC774 \uAC00\uB2A5\uD55C ${seed} \uCCAB \uC601\uC0C1`
        : `\uC5BC\uAD74 \uC5C6\uC774 \uAC00\uB2A5\uD55C ${seed} \uCCAB \uC601\uC0C1 \uC544\uC774\uB514\uC5B4`,
      hook3
        ? `${hook3} - ${seed} \uCD08\uBCF4\uAC00 \uBC14\uB85C \uC2DC\uC791\uD558\uB294 \uBC95`
        : `\uC624\uB298 \uBC14\uB85C \uCC0D\uC744 \uC218 \uC788\uB294 ${seed} 2\uBD84 \uC601\uC0C1 \uAD6C\uC131`,
      `${seed} \uCD08\uBCF4\uAC00 \uCCAB \uC601\uC0C1\uC73C\uB85C \uC2DC\uC791\uD558\uAE30 \uC88B\uC740 \uC8FC\uC81C 3\uAC00\uC9C0`
    ],
    thumbnailCandidates,
    videoOutline: [
      "\uC624\uD504\uB2DD 15\uCD08: \uC624\uB298 \uB2E4\uB140 \uBB38\uC81C\uC640 \uC2DC\uCCAD\uC790\uAC00 \uC5BB\uC744 \uC810\uC744 \uBC14\uB85C \uB9D0\uD55C\uB2E4.",
      "\uD30C\uD2B8 1 35\uCD08: \uC120\uD0DD\uD55C \uB728\uB294 \uC601\uC0C1 3\uAC1C\uC758 \uACF5\uD1B5 \uC81C\uBAA9/\uC368\uB124\uC77C \uD3EC\uC778\uD2B8\uB97C \uD55C \uBB38\uC7A5\uC73C\uB85C \uC815\uB9AC\uD55C\uB2E4.",
      "\uD30C\uD2B8 2 45\uCD08: \uB0B4 \uC0C1\uD669\uC5D0 \uB9DE\uAC8C \uC9C1\uC811 \uD574\uBCF8 \uBC29\uBC95\uC774\uB098 \uC900\uBE44 \uACFC\uC815\uC744 \uC124\uBA85\uD55C\uB2E4.",
      "\uD30C\uD2B8 3 20\uCD08: \uCD08\uBCF4\uC790\uAC00 \uB530\uB77C \uD560 \uC218 \uC788\uB294 \uD575\uC2EC \uD589\uB3D9 1\uAC00\uC9C0\uB97C \uBCF4\uC5EC\uC900\uB2E4.",
      "\uB9C8\uBB34\uB9AC 5\uCD08: \uB2E4\uC74C\uC5D0 \uD574\uBCFC \uC77C\uACFC \uCC44\uB110\uC5D0\uC11C \uC774\uC5B4\uAC08 \uC8FC\uC81C\uB97C \uC9E7\uAC8C \uB0A8\uAE34\uB2E4."
    ],
    sevenDayPlan: [
      {
        day: 1,
        title: "\uC8FC\uC81C \uD655\uC815\uACFC \uC720\uD29C\uBE0C \uD504\uB85C\uD544 \uC124\uC815",
        task: "\uC9C4\uB2E8 \uACB0\uACFC\uB85C \uCD94\uCC9C \uC8FC\uC81C\uC640 \uD0A4\uC6CC\uB4DC\uB97C \uC815\uD558\uACE0 \uCC44\uB110\uBA85, \uC18C\uAC1C \uBB38\uAD6C, \uD504\uB85C\uD544 \uC774\uBBF8\uC9C0\uB97C \uC784\uC2DC\uB85C \uC124\uC815\uD55C\uB2E4."
      },
      {
        day: 2,
        title: "\uC601\uC0C1 3\uAC1C \uC120\uD0DD\uACFC \uBB38\uAD6C \uD655\uC815",
        task: "\uB9C8\uC74C\uC5D0 \uB4DC\uB294 \uB728\uB294 \uC601\uC0C1 3\uAC1C\uB97C \uC120\uD0DD\uD558\uACE0 \uC81C\uBAA9 5\uAC1C, \uC368\uB124\uC77C \uBB38\uAD6C 5\uAC1C \uC911 \uAC01\uAC01 1\uAC1C\uB97C \uACE0\uB978\uB2E4."
      },
      {
        day: 3,
        title: "\uC368\uB124\uC77C \uB9CC\uB4E4\uAE30",
        task: "\uBBF8\uB9AC\uCE94\uBC84\uC2A4 \uBB34\uB8CC\uBC84\uC804\uC73C\uB85C \uC368\uB124\uC77C\uC744 \uB9CC\uB4E4\uACE0, \uBB38\uAD6C \uC8FC\uBCC0 \uBE48 \uACF5\uAC04\uC5D0 \uB123\uC744 \uC0AC\uC9C4 \uAD6C\uC131\uC744 \uC815\uD55C\uB2E4."
      },
      {
        day: 4,
        title: "2\uBD84 \uAD6C\uC131\uC548\uACFC \uB098\uB808\uC774\uC158 \uB179\uC74C",
        task: "\uC120\uD0DD\uD55C 3\uAC1C \uC601\uC0C1\uC758 \uC81C\uBAA9, \uC368\uB124\uC77C, \uCD08\uBC18 \uD750\uB984\uC744 \uCC38\uACE0\uD574 2\uBD84 \uAD6C\uC131\uC548\uC744 \uB9CC\uB4E4\uACE0 \uB098\uB808\uC774\uC158\uC744 \uB179\uC74C\uD55C\uB2E4."
      },
      {
        day: 5,
        title: "\uC2A4\uB9C8\uD2B8\uD3F0 \uCD2C\uC601",
        task: "2\uBD84 \uAD6C\uC131\uC548\uC5D0 \uB9DE\uCD94 \uD544\uC694\uD55C \uC7A5\uBA74\uACFC \uC368\uB124\uC77C \uC0AC\uC9C4\uC744 \uC2A4\uB9C8\uD2B8\uD3F0\uC73C\uB85C \uCD2C\uC601\uD55C\uB2E4."
      },
      {
        day: 6,
        title: "\uCE90\uCEF7 \uD3B8\uC9D1",
        task: "\uCE90\uCEF7\uC5D0\uC11C \uB098\uB808\uC774\uC158 \uD750\uB984\uC5D0 \uB9DE\uAC8C \uC7A5\uBA74\uC744 \uBC30\uCE58\uD558\uACE0 \uBD88\uD544\uC694\uD55C \uAD6C\uAC04\uC744 \uC790\uB978\uB2E4."
      },
      {
        day: 7,
        title: "\uC5C5\uB85C\uB4DC\uC640 \uCC44\uB110 \uD655\uC778",
        task: "\uD575\uC2EC \uD0A4\uC6CC\uB4DC\uB97C \uC124\uBA85\uB780\uC5D0 \uC790\uC5F0\uC2A4\uB7FD\uAC8C \uB123\uACE0 \uC5C5\uB85C\uB4DC\uD55C \uB4A4 \uCC44\uB110\uC5D0\uC11C \uC815\uC0C1 \uC5C5\uB85C\uB4DC\uB97C \uD655\uC778\uD55C\uB2E4."
      }
    ]
  };
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

function getHook(title: string): string | undefined {
  const parts = title.split(/[|:,\-\u2013\u2014]/);
  const hook = parts[0]?.trim();
  return hook || undefined;
}

function extractNumericThumb(title: string): string | undefined {
  const patterns = [
    /\uC6D4\s*\d+\uB9CC\uC6D0/,
    /\d+\s*\uB9CC\uC6D0/,
    /\d+\s*\uAC00\uC9C0/,
    /\d+\s*\uBD84\s*\uB9CC\uC5D0/,
    /\d+\s*\uC77C\s*\uB9CC\uC5D0/,
    /\d+\s*\uBC30/
  ];
  for (const pat of patterns) {
    const match = title.match(pat);
    if (match) return match[0].replace(/\s+/g, " ").trim();
  }
  return undefined;
}

function toShortThumb(hook: string | undefined): string | undefined {
  if (!hook) return undefined;
  const words = hook.split(/\s+/).slice(0, 2).join(" ");
  return words.length <= 10 ? words : undefined;
}

function dedup(arr: string[]): string[] {
  const seen = new Set<string>();
  return arr.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

function withDirectionParticle(value: string) {
  const lastChar = value.trim().at(-1);
  if (!lastChar) return value;

  const code = lastChar.charCodeAt(0);
  const hangulStart = 0xac00;
  const hangulEnd = 0xd7a3;

  if (code < hangulStart || code > hangulEnd) {
    return `${value}\uB85C`;
  }

  const hasFinalConsonant = (code - hangulStart) % 28 !== 0;
  return `${value}${hasFinalConsonant ? "\uC73C\uB85C" : "\uB85C"}`;
}
