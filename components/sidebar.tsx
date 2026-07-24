"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminNavigation, currentAdminRole } from "@/lib/admin-config";
import { cn } from "@/lib/utils";

function SidebarIcon({ name, active }: { name: (typeof adminNavigation)[number]["icon"]; active: boolean }) {
  const stroke = active ? "currentColor" : "#475467";
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "shrink-0"
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <path d="M2.5 2.5H6.5V6.5H2.5V2.5Z" stroke={stroke} strokeWidth="1.4" rx="1" />
          <path d="M9.5 2.5H13.5V9H9.5V2.5Z" stroke={stroke} strokeWidth="1.4" rx="1" />
          <path d="M2.5 9.5H6.5V13.5H2.5V9.5Z" stroke={stroke} strokeWidth="1.4" rx="1" />
          <path d="M9.5 12H13.5V13.5H9.5V12Z" stroke={stroke} strokeWidth="1.4" rx="0.6" />
        </svg>
      );
    case "users":
      return (
        <svg {...props}>
          <circle cx="6" cy="5.5" r="2.2" stroke={stroke} strokeWidth="1.4" />
          <path d="M2.8 12.8C3.3 10.9 4.6 10 6 10C7.4 10 8.7 10.9 9.2 12.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="11.5" cy="6.2" r="1.7" stroke={stroke} strokeWidth="1.4" />
          <path d="M10 12.4C10.3 11.1 11.2 10.4 12.2 10.2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "partners":
      return (
        <svg {...props}>
          <path d="M3 4.5H13V12.5H3V4.5Z" stroke={stroke} strokeWidth="1.4" rx="1.2" />
          <path d="M6 4.5V12.5" stroke={stroke} strokeWidth="1.4" />
          <path d="M8.5 7H10.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8.5 9.5H11.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4 3V4.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M12 3V4.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "catalog":
      return (
        <svg {...props}>
          <path d="M3 3.5H8.5C9.6 3.5 10.5 4.4 10.5 5.5V12.5H5C3.9 12.5 3 11.6 3 10.5V3.5Z" stroke={stroke} strokeWidth="1.4" />
          <path d="M10.5 5H12C12.6 5 13 5.4 13 6V12.5H10.5" stroke={stroke} strokeWidth="1.4" />
          <path d="M5 6.5H8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5 9H8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "culture":
      return (
        <svg {...props}>
          <path d="M8 2.8L9.5 5.9L13 6.4L10.5 8.8L11.1 12.2L8 10.5L4.9 12.2L5.5 8.8L3 6.4L6.5 5.9L8 2.8Z" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case "places":
      return (
        <svg {...props}>
          <path d="M8 13C10.4 10.1 11.6 8.3 11.6 6.5C11.6 4.5 10 3 8 3C6 3 4.4 4.5 4.4 6.5C4.4 8.3 5.6 10.1 8 13Z" stroke={stroke} strokeWidth="1.4" />
          <circle cx="8" cy="6.4" r="1.6" stroke={stroke} strokeWidth="1.4" />
        </svg>
      );
    case "moderation":
      return (
        <svg {...props}>
          <path d="M8 2.8L12 4.4V7.2C12 9.6 10.4 11.7 8 12.6C5.6 11.7 4 9.6 4 7.2V4.4L8 2.8Z" stroke={stroke} strokeWidth="1.4" />
          <path d="M6.4 7.5L7.4 8.5L9.8 6.1" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "trust":
      return (
        <svg {...props}>
          <path d="M8 2.8L12 4.4V7.2C12 9.6 10.4 11.7 8 12.6C5.6 11.7 4 9.6 4 7.2V4.4L8 2.8Z" stroke={stroke} strokeWidth="1.4" />
          <path d="M8 5.5V8.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="10.4" r="0.6" fill={stroke} />
        </svg>
      );
    case "gamification":
      return (
        <svg {...props}>
          <path d="M5 3.5H11V6C11 7.7 9.7 9 8 9C6.3 9 5 7.7 5 6V3.5Z" stroke={stroke} strokeWidth="1.4" />
          <path d="M5 4.6H3.8C3.4 4.6 3 5 3 5.4C3 6.5 3.8 7.4 5 7.4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11 4.6H12.2C12.6 4.6 13 5 13 5.4C13 6.5 12.2 7.4 11 7.4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 9V12.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6 12.5H10" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "campaigns":
      return (
        <svg {...props}>
          <path d="M3 9V5.2C3 4.6 3.4 4.2 4 4.2H9L12.5 2.8V11.2L9 9.8H4C3.4 9.8 3 9.4 3 8.8V9Z" stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5 10V12.3" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="7" cy="7" r="3.5" stroke={stroke} strokeWidth="1.4" />
          <path d="M9.8 9.8L13 13" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...props}>
          <path d="M3 12.5H13" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4.5 10V7.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 10V4.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11.5 10V6.2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="8" cy="8" r="2.1" stroke={stroke} strokeWidth="1.4" />
          <path d="M8 3V4.2" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 11.8V13" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13 8H11.8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4.2 8H3" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11.5 4.5L10.6 5.4" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5.4 10.6L4.5 11.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M11.5 11.5L10.6 10.6" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5.4 5.4L4.5 4.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const visibleModules = adminNavigation.filter((item) => item.roles.some((role) => role === currentAdminRole));

  return (
    <aside className="admin-sidebar sticky top-0 hidden h-screen overflow-hidden text-slate-900 xl:block">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 text-lg font-bold text-white">Y</div>
          <div className="text-[18px] font-semibold tracking-tight text-rose-600">YEYAMO</div>
        </div>
      </div>

      <nav className="px-4 py-4">
        <ul className="space-y-1">
          {visibleModules.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm font-bold transition-colors",
                    active
                      ? "border-[#e30613] bg-[#e30613] text-white shadow-[0_8px_16px_rgba(227,6,19,0.18)]"
                      : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <SidebarIcon name={item.icon} active={active} />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]",
                        active ? "border border-white/20 bg-white/10 text-white" : "border border-slate-200 bg-white text-slate-600"
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
