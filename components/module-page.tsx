import { AdminResourcePage } from "@/components/admin-resource-page";
import type { AdminModule } from "@/lib/admin-config";

export function ModulePage({ module }: { module: AdminModule }) {
  return <AdminResourcePage module={module} />;
}
