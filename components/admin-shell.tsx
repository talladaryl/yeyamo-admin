"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    function closeDrawer(event: KeyboardEvent) {
      if (event.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", closeDrawer);
    return () => document.removeEventListener("keydown", closeDrawer);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-app" data-sidebar-open={sidebarOpen ? "true" : "false"} data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
      <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggleCollapsed={() => setSidebarCollapsed((value) => !value)} onLogout={() => void logout()} />
      <div className="admin-shell">
        <Topbar onMenuClick={() => setSidebarOpen((value) => !value)} onLogout={() => void logout()} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
