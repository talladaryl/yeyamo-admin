import type { Metadata } from "next";
import { ResourcePage } from "@/components/landing/resource-page";
import { getPublicLocale } from "@/lib/public/locale";
import { privacyContent } from "@/lib/public/resource-content";

type Props = { searchParams: Promise<{ lang?: string | string[] }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const content = privacyContent[getPublicLocale((await searchParams).lang)];
  return { title: `${content.title} | YeYamo`, description: content.intro };
}
export default async function PrivacyPage({ searchParams }: Props) {
  return <ResourcePage kind="privacy" locale={getPublicLocale((await searchParams).lang)} />;
}
