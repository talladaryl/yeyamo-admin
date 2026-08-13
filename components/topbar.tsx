"use client";

import { Bell, CalendarDays, ChevronDown, LayoutDashboard, Menu, Search, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { getModuleByHref } from "@/lib/admin-config";

function getTopbarCopy(pathname: string) {
  if (pathname === "/admin") {
    return {
      title: "Tableau de bord",
      subtitle: "Bienvenue sur l'administration YeYamo"
    };
  }

  const adminModule = getModuleByHref(pathname);

  if (adminModule) {
    return {
      title: adminModule.label,
      subtitle: adminModule.summary
    };
  }

  return {
    title: "Administration YeYamo",
    subtitle: "Pilotage des espaces, contenus et performances"
  };
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const copy = getTopbarCopy(pathname);

  return (
    <header className="admin-topbar">
      <div className="admin-topbar__headline">
        <button type="button" className="admin-topbar__menu" onClick={onMenuClick} aria-label="Ouvrir le menu">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="admin-topbar__title">
            {pathname === "/admin" ? <LayoutDashboard size={22} className="admin-topbar__title-icon" aria-hidden="true" /> : null}
            <span>{copy.title}</span>
          </h1>
          <p className="admin-topbar__subtitle">{copy.subtitle}</p>
        </div>
      </div>

      <div className="admin-topbar__actions">
        <label className="admin-topbar__search">
          <Search size={18} aria-hidden="true" />
          <input type="search" placeholder="Rechercher un lieu, un utilisateur..." aria-label="Rechercher un lieu, un utilisateur..." />
        </label>

        <button type="button" className="admin-topbar__icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="admin-topbar__badge">5</span>
        </button>

        <button type="button" className="admin-topbar__period" aria-label="Sélectionner la période">
          <CalendarDays size={18} aria-hidden="true" />
          <span>01/06/2024 - 07/06/2024</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>

        <button type="button" className="admin-topbar__user" aria-label="Compte utilisateur">
          <span className="admin-topbar__user-avatar">
            <UserCircle2 size={18} />
          </span>
          <span className="admin-topbar__user-name">Paul M.</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
