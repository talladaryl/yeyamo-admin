"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FolderOpen,
  FolderUp,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Rocket,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Star,
  Ticket,
  TriangleAlert,
  Users,
  type LucideIcon
} from "lucide-react";

import { adminNavigation } from "@/lib/admin-config";
import { can } from "@/features/auth/permissions";
import { useAdminSession } from "@/features/auth/session-context";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  users: Users,
  places: Building2,
  calendar: CalendarDays,
  reservations: Ticket,
  reviews: MessageSquareText,
  partners: Users,
  catalog: FolderOpen,
  import: FolderUp,
  culture: ShieldCheck,
  moderation: ShieldAlert,
  trust: ShieldCheck,
  gamification: Star,
  campaigns: Rocket,
  alert: TriangleAlert,
  message: Mail,
  mail: Mail,
  search: Search,
  analytics: ClipboardList,
  settings: Settings
};

export function Sidebar({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { session } = useAdminSession();
  const visibleModules = adminNavigation.filter((module) => module.showInSidebar !== false && can(session, module));
  const displayName = [session?.firstName, session?.lastName].filter(Boolean).join(" ") || session?.email || "Administrateur";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <aside className={cn("admin-sidebar", open && "admin-sidebar--open")}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-mark">
            <Image src="/brand/yeyamo-logo.png" alt="" width={44} height={44} priority />
          </div>
          <div>
            <p className="admin-sidebar__title">YeYamo</p>
            <p className="admin-sidebar__subtitle">Administration</p>
          </div>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Navigation administrateur">
          {visibleModules.map((module, index) => {
            const active =
              pathname === module.href || (pathname.startsWith(module.href + "/") && module.href !== "/admin");
            const Icon = iconMap[module.icon] ?? LayoutDashboard;

            return (
              <Link
                key={`${module.href}-${module.label}-${index}`}
                href={module.href as Route}
                className={cn("admin-sidebar__link", active && "is-active")}
                onClick={onClose}
              >
                <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
                <span>{module.label}</span>
                {module.badge ? <span className="admin-sidebar__badge">{module.badge}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__profile">
          <div className="admin-sidebar__avatar">{initials}</div>
          <div className="admin-sidebar__profile-copy">
            <p className="admin-sidebar__profile-name">{displayName}</p>
            <p className="admin-sidebar__profile-role">{session?.roles[0] ?? "—"}</p>
          </div>
          <ChevronDown size={18} aria-hidden="true" />
        </div>
      </aside>

      <button
        type="button"
        className={cn("admin-sidebar__scrim", open && "is-visible")}
        aria-label="Fermer le menu latéral"
        onClick={onClose}
      />
    </>
  );
}
