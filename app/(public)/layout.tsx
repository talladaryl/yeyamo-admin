import type { ReactNode } from "react";
import { PublicProviders } from "@/components/public/public-providers";
import { PublicShell } from "@/components/public/public-shell";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicProviders><PublicShell>{children}</PublicShell></PublicProviders>;
}
