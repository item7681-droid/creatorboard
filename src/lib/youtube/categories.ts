export const categoryLabels: Record<string, string> = {
  "1": "연예/반응/이슈",
  "2": "제품 비교/리뷰",
  "10": "음악",
  "15": "일상/경험담",
  "17": "운동/건강",
  "19": "여행/장소 기록",
  "20": "게임",
  "22": "일상/경험담",
  "23": "연예/반응/이슈",
  "24": "연예/반응/이슈",
  "25": "뉴스/사회 이슈",
  "26": "부업/재테크/방법론",
  "27": "자기계발/공부",
  "28": "제품 비교/리뷰",
  "29": "뉴스/사회 이슈"
};

export const categoryEnglishLabels: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos & Vehicles",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "19": "Travel & Events",
  "20": "Gaming",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
  "29": "Nonprofits & Activism"
};

export function getCategoryLabel(categoryId?: string, fallback?: string) {
  if (!categoryId) return fallback ?? "추천 분류";
  return categoryLabels[categoryId] ?? fallback ?? "추천 분류";
}

export function getCategoryDisplayLabel(categoryId?: string, fallback?: string) {
  return getCategoryLabel(categoryId, fallback);
}
