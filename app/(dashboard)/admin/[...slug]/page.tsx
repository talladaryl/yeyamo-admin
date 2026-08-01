import { ModulePage } from "@/components/module-page";
import { getModuleByHref } from "@/lib/admin-config";
import { notFound } from "next/navigation";

export default async function AdminModuleRoute({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const href = `/admin/${slug.join("/")}`;
  const adminModule = getModuleByHref(href);

  if (!adminModule) {
    notFound();
  }

  return <ModulePage module={adminModule} />;
}
