import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin-shell";

import "./admin.css";

export const metadata: Metadata = {
  title: "YeYamo Administration",
  description: "Dashboard administrateur YeYamo"
};

export default function AdminLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
