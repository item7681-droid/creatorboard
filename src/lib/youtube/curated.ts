import type { VideoCandidate } from "./types";

const base: Array<Omit<VideoCandidate, "id" | "keyword">> = [
  {
    youtubeVideoId: "demo-01",
    title: "퇴근 후 1시간으로 월 30만원 부업 루틴 만들기",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    thumbnailText: "퇴근 후 1시간",
    channelTitle: "Side Hustle Lab",
    viewCount: 238000,
    likeCount: 7200,
    commentCount: 412,
    publishedAt: "2026-06-01T00:00:00.000Z",
    durationSeconds: 512
  },
  {
    youtubeVideoId: "demo-02",
    title: "초보가 처음 시작하기 좋은 얼굴 없는 유튜브 주제 7가지",
    thumbnailUrl: "https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg",
    thumbnailText: "얼굴 없이 가능",
    channelTitle: "Creator Start",
    viewCount: 181000,
    likeCount: 5400,
    commentCount: 298,
    publishedAt: "2026-05-28T00:00:00.000Z",
    durationSeconds: 624
  },
  {
    youtubeVideoId: "demo-03",
    title: "월 10만원을 목표로 첫 유튜브 영상을 고르는 방법",
    thumbnailUrl: "https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg",
    thumbnailText: "첫 영상 고르기",
    channelTitle: "Small Creator",
    viewCount: 96000,
    likeCount: 3100,
    commentCount: 144,
    publishedAt: "2026-05-18T00:00:00.000Z",
    durationSeconds: 480
  },
  {
    youtubeVideoId: "demo-04",
    title: "내 경험을 돈 되는 콘텐츠로 바꾸는 5단계",
    thumbnailUrl: "https://i.ytimg.com/vi/oHg5SJYRHA0/hqdefault.jpg",
    thumbnailText: "경험이 콘텐츠",
    channelTitle: "Personal Brand Note",
    viewCount: 142000,
    likeCount: 4600,
    commentCount: 221,
    publishedAt: "2026-05-10T00:00:00.000Z",
    durationSeconds: 711
  },
  {
    youtubeVideoId: "demo-05",
    title: "촬영 장비 없이 스마트폰으로 첫 영상 만드는 현실 가이드",
    thumbnailUrl: "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg",
    thumbnailText: "스마트폰이면 충분",
    channelTitle: "No Gear Creator",
    viewCount: 205000,
    likeCount: 6500,
    commentCount: 330,
    publishedAt: "2026-04-27T00:00:00.000Z",
    durationSeconds: 598
  }
];

export function getCuratedVideos(keyword: string, count = 15): VideoCandidate[] {
  return Array.from({ length: count }, (_, index) => {
    const item = base[index % base.length];
    return {
      ...item,
      id: `curated-${index + 1}`,
      keyword,
      youtubeVideoId: `${item.youtubeVideoId}-${index + 1}`,
      title: index < base.length ? item.title : `${item.title} #${Math.floor(index / base.length) + 1}`,
      viewCount: item.viewCount + index * 7300,
      likeCount: item.likeCount + index * 180,
      commentCount: item.commentCount + index * 17
    };
  });
}
