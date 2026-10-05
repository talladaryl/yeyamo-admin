"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2, CalendarDays, ChevronDown, ClipboardList, FolderOpen, FolderUp,
  LayoutDashboard, LogOut, Mail, MessageSquareText, PanelLeftClose, PanelLeftOpen,
  Rocket, Search, Settings, ShieldAlert, ShieldCheck, Star, Ticket, TriangleAlert,
  Users, type LucideIcon,
} from "lucide-react";

import { AnimatedLogo } from "@/components/animated-logo";
import { can } from "@/features/auth/permissions";
import { useAdminSession } from "@/features/auth/session-context";
import { adminNavigation, type AdminModule } from "@/lib/admin-config";
import { groupVisibleAdminModules } from "@/lib/admin-navigation-groups";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard, users: Users, places: Building2, calendar: CalendarDays,
  reservations: Ticket, reviews: MessageSquareText, partners: Users, catalog: FolderOpen,
  import: FolderUp, culture: ShieldCheck, moderation: ShieldAlert, trust: ShieldCheck,
  gamification: Star, campaigns: Rocket, alert: TriangleAlert, message: Mail, mail: Mail,
  search: Search, analytics: ClipboardList, settings: Settings,
};

type SidebarProps = {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
  onLogout: () => void;
};

export function Sidebar({ open, collapsed, onClose, onToggleCollapsed, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { session } = useAdminSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const visibleModules = useMemo(() => adminNavigation.filter((module) => module.showInSidebar !== false && can(session, module)), [session]);
  const displayName = [session?.firstName, session?.lastName].filter(Boolean).join(" ") || session?.email || "Administrateur";
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const { dashboard, groups, ungrouped } = useMemo(() => groupVisibleAdminModules(visibleModules), [visibleModules]);
  const allGroups = useMemo(() => ungrouped.length ? [...groups, { title: "Autres", modules: ungrouped }] : groups, [groups, ungrouped]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => Object.fromEntries(
    allGroups.map((group) => [group.title, group.modules.some((module) => pathname === module.href || pathname.startsWith(module.href + "/"))]),
  ));

  useEffect(() => {
    const activeGroup = allGroups.find((group) => group.modules.some((module) => pathname === module.href || pathname.startsWith(module.href + "/")));
    if (!activeGroup) return;
    const frame = requestAnimationFrame(() => setOpenGroups((current) => current[activeGroup.title] ? current : { ...current, [activeGroup.title]: true }));
    return () => cancelAnimationFrame(frame);
  }, [allGroups, pathname]);

  useEffect(() => {
    function closeProfileMenu(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setProfileMenuOpen(false);
      } else if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", closeProfileMenu);
    document.addEventListener("keydown", closeProfileMenu);
    return () => {
      document.removeEventListener("mousedown", closeProfileMenu);
      document.removeEventListener("keydown", closeProfileMenu);
    };
  }, []);

  return <>
    <aside className={cn("admin-sidebar", open && "admin-sidebar--open")}>
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__brand-mark"><AnimatedLogo compact /></div>
        <div className="admin-sidebar__brand-copy">
          <p className="admin-sidebar__title">YeYamo</p>
          <p className="admin-sidebar__subtitle">Administration</p>
        </div>
        <button type="button" className="admin-sidebar__collapse" onClick={onToggleCollapsed} aria-expanded={!collapsed} aria-label={collapsed ? "Déplier la barre latérale" : "Réduire la barre latérale"}>
          {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
        </button>
      </div>

      <nav className="admin-sidebar__nav" aria-label="Navigation administrateur">
        {dashboard ? <SidebarItem module={dashboard} pathname={pathname} collapsed={collapsed} onSelect={onClose} /> : null}
        {allGroups.map((group) => <SidebarGroup key={group.title} title={group.title} modules={group.modules} pathname={pathname} collapsed={collapsed} open={collapsed || Boolean(openGroups[group.title])} onToggle={() => setOpenGroups((current) => ({ ...current, [group.title]: !current[group.title] }))} onSelect={onClose} />)}
      </nav>

      <div className="admin-sidebar__profile-wrap" ref={profileRef}>
        {profileMenuOpen ? <div className="admin-sidebar__profile-menu" role="menu" aria-label="Menu du compte administrateur">
          <Link href="/admin/settings/security" role="menuitem" onClick={() => { setProfileMenuOpen(false); onClose(); }}><Settings size={17} aria-hidden="true" /><span>Sécurité du compte</span></Link>
          <button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); onLogout(); }}><LogOut size={17} aria-hidden="true" /><span>Se déconnecter</span></button>
        </div> : null}
        <button type="button" className="admin-sidebar__profile" onClick={() => setProfileMenuOpen((value) => !value)} aria-haspopup="menu" aria-expanded={profileMenuOpen} aria-label={`Compte de ${displayName}`}>
          <span className="admin-sidebar__avatar">{initials}</span>
          <span className="admin-sidebar__profile-copy">
            <span className="admin-sidebar__profile-name">{displayName}</span>
            <span className="admin-sidebar__profile-role">{session?.roles[0] ?? "—"}</span>
          </span>
          <ChevronDown className={cn("admin-sidebar__profile-chevron", profileMenuOpen && "is-open")} size={18} aria-hidden="true" />
        </button>
      </div>
    </aside>
    <button type="button" className={cn("admin-sidebar__scrim", open && "is-visible")} aria-label="Fermer le menu latéral" onClick={onClose} />
  </>;
}

function SidebarGroup({ title, modules, pathname, collapsed, open, onToggle, onSelect }: { title: string; modules: AdminModule[]; pathname: string; collapsed: boolean; open: boolean; onToggle: () => void; onSelect: () => void }) {
  return <section className="admin-sidebar__group" aria-label={title}>
    {!collapsed ? <button type="button" className="admin-sidebar__group-title" onClick={onToggle} aria-expanded={open} aria-controls={`admin-sidebar-group-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`}><span>{title}</span><ChevronDown size={15} aria-hidden="true" className={cn(open && "is-open")} /></button> : null}
    {open ? <div id={`admin-sidebar-group-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} className="admin-sidebar__group-items">{modules.map((module) => <SidebarItem key={module.href} module={module} pathname={pathname} collapsed={collapsed} onSelect={onSelect} />)}</div> : null}
  </section>;
}

function SidebarItem({ module, pathname, collapsed, onSelect }: { module: AdminModule; pathname: string; collapsed: boolean; onSelect: () => void }) {
  const active = pathname === module.href || (pathname.startsWith(module.href + "/") && module.href !== "/admin");
  const Icon = iconMap[module.icon] ?? LayoutDashboard;
  const tooltip = module.badge ? `${module.label} — ${module.badge}` : module.label;
  return <Link href={module.href as Route} className={cn("admin-sidebar__link", active && "is-active")} onClick={onSelect} aria-current={active ? "page" : undefined} aria-label={collapsed ? tooltip : undefined} data-tooltip={tooltip}>
    <Icon size={18} strokeWidth={2.1} aria-hidden="true" />
    <span className="admin-sidebar__link-label">{module.label}</span>
    {module.badge ? <span className="admin-sidebar__badge" aria-label={module.badge}>{collapsed ? <span aria-hidden="true" /> : module.badge}</span> : null}
  </Link>;
}
