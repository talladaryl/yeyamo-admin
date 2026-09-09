import type { ReactNode } from "react";
import { UserSessionProvider } from "@/features/user-auth/user-session-context";
export default function AuthLayout({ children }: { children: ReactNode }) { return <UserSessionProvider><main className="yy-auth-shell"><div className="yy-auth-brand">Yeyamo</div>{children}</main></UserSessionProvider>; }
