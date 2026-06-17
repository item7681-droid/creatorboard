"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cacheCompletedDay, completedDayFromStatus, FLOW_PROGRESS_EVENT, readCachedCompletedDay } from "@/lib/flow/progress";

const days = [
  { day: 1, href: "/diagnosis/result" },
  { day: 2, href: "/videos" },
  { day: 3, href: "/thumbnail" },
  { day: 4, href: "/result" },
  { day: 5, href: "/shooting" },
  { day: 6, href: "/edit" },
  { day: 7, href: "/upload" }
];

export function DayNav() {
  const pathname = usePathname();
  const [completedDay, setCompletedDay] = useState(0);

  useEffect(() => {
    setCompletedDay(readCachedCompletedDay());

    async function loadProgress() {
      const response = await fetch("/api/flow/current");
      if (!response.ok) return;
      const data = await response.json();
      const serverDay =
        typeof data.progress?.completedDay === "number"
          ? data.progress.completedDay
          : completedDayFromStatus(data.diagnosis?.status);
      cacheCompletedDay(serverDay);
      setCompletedDay(readCachedCompletedDay());
    }

    function handleProgress(event: Event) {
      const detail = (event as CustomEvent<{ completedDay?: number }>).detail;
      setCompletedDay(detail?.completedDay ?? readCachedCompletedDay());
    }

    loadProgress();
    window.addEventListener(FLOW_PROGRESS_EVENT, handleProgress);
    window.addEventListener("storage", handleProgress);
    return () => {
      window.removeEventListener(FLOW_PROGRESS_EVENT, handleProgress);
      window.removeEventListener("storage", handleProgress);
    };
  }, []);

  return (
    <div className="day-nav" aria-label="7일 실행 단계">
      {days.map((item) => {
        const label = `DAY ${item.day}`;
        const active =
          (item.day === 1 && pathname === "/diagnosis/result") ||
          (item.day === 2 && pathname === "/videos") ||
          (item.day === 3 && pathname === "/thumbnail") ||
          (item.day === 4 && pathname === "/result") ||
          (item.day === 5 && pathname === "/shooting") ||
          (item.day === 6 && pathname === "/edit") ||
          (item.day === 7 && pathname === "/upload");
        const completed = item.day <= completedDay;

        if (!item.href) {
          return (
            <span className="day-nav-item disabled" key={item.day}>
              {label}
            </span>
          );
        }

        return (
          <Link className={`day-nav-item ${active ? "active" : ""} ${completed ? "completed" : ""}`} href={item.href} key={item.day}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
