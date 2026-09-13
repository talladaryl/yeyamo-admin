import type { Metadata } from "next";
import { ResourcePage } from "@/components/landing/resource-page";
import { getPublicLocale } from "@/lib/public/locale";
import { documentationContent } from "@/lib/public/resource-content";

type Props = { searchParams: Promise<{ lang?: string | string[] }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const content = documentationContent[getPublicLocale((await searchParams).lang)];
  return { title: `${content.title} | YeYamo`, description: content.intro };
}
export default async function DocumentationPage({ searchParams }: Props) {
  return <ResourcePage kind="documentation" locale={getPublicLocale((await searchParams).lang)} />;
}
