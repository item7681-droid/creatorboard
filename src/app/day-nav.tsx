"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

        if (!item.href) {
          return (
            <span className="day-nav-item disabled" key={item.day}>
              {label}
            </span>
          );
        }

        return (
          <Link className={`day-nav-item ${active ? "active" : ""}`} href={item.href} key={item.day}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
