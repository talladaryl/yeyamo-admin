"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="admin-app" data-sidebar-open={sidebarOpen ? "true" : "false"}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-shell">
        <Topbar onMenuClick={() => setSidebarOpen((value) => !value)} />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
