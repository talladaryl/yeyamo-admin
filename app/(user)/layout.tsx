import type { ReactNode } from "react";
import { PublicProviders } from "@/components/public/public-providers";
import { PublicShell } from "@/components/public/public-shell";
import { UserGuard } from "@/features/user-auth/user-guard";

export default function UserLayout({ children }: { children: ReactNode }) {
  return <PublicProviders><UserGuard><PublicShell>{children}</PublicShell></UserGuard></PublicProviders>;
}
