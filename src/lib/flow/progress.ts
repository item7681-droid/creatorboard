export const FLOW_PROGRESS_KEY = "creatorboard_completed_day";
export const FLOW_PROGRESS_EVENT = "creatorboard-progress";

export function readCachedCompletedDay() {
  if (typeof window === "undefined") return 0;
  const value = Number(localStorage.getItem(FLOW_PROGRESS_KEY) ?? "0");
  return Number.isFinite(value) ? Math.max(0, Math.min(7, value)) : 0;
}

export function cacheCompletedDay(day: number) {
  if (typeof window === "undefined") return;
  const nextDay = Math.max(readCachedCompletedDay(), Math.max(0, Math.min(7, day)));
  localStorage.setItem(FLOW_PROGRESS_KEY, String(nextDay));
  window.dispatchEvent(new CustomEvent(FLOW_PROGRESS_EVENT, { detail: { completedDay: nextDay } }));
}

export async function markCompletedDay(day: number, generationSessionId?: string) {
  cacheCompletedDay(day);

  if (!generationSessionId) return;

  await fetch("/api/flow/progress", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ generationSessionId, completedDay: day })
  });
}

export function completedDayFromStatus(status?: string | null) {
  if (!status) return 0;
  const match = status.match(/^day-(\d)$/);
  if (match) return Math.max(0, Math.min(7, Number(match[1])));
  if (status === "saved") return 1;
  if (status === "generated") return 2;
  return 0;
}
