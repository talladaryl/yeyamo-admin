import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicSectionPage } from "@/components/landing/public-section-page";
import { PublicLanguageProvider } from "@/components/landing/public-language";
import { getPublicLocale } from "@/lib/public/locale";
import { isPublicPage, publicPages } from "@/lib/public/pages";

type Props = { params: Promise<{ publicPage: string }>; searchParams: Promise<{ lang?: string | string[] }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { publicPage } = await params;
  if (!isPublicPage(publicPage)) notFound();
  const locale = getPublicLocale((await searchParams).lang);
  return { title: `${publicPages[publicPage][locale]} | YeYamo` };
}
export default async function PublicPage({ params, searchParams }: Props) {
  const { publicPage } = await params;
  if (!isPublicPage(publicPage)) notFound();
  const locale = getPublicLocale((await searchParams).lang);
  return <PublicLanguageProvider locale={locale}><PublicSectionPage page={publicPage} /></PublicLanguageProvider>;
}
