import type { ReactNode } from "react";
import { PublicHeader, PublicNavigation } from "@/components/public/public-navigation";

export function PublicShell({ children, contextPanel }: { children: ReactNode; contextPanel?: ReactNode }) {
  return <div className="yy-public-shell"><PublicHeader /><PublicNavigation mode="sidebar" /><PublicNavigation mode="rail" /><main className="yy-public-main">{children}</main>{contextPanel ? <aside className="yy-context-panel">{contextPanel}</aside> : null}<PublicNavigation mode="bottom" /></div>;
}
