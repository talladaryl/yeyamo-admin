import type { Metadata } from "next";
import HomeContent from "@/components/landing/home-content";
import { LandingIntro } from "@/components/landing/landing-intro";
import { PublicLanguageProvider } from "@/components/landing/public-language";
import { getPublicLocale } from "@/lib/public/locale";

type Props = { searchParams: Promise<{ lang?: string | string[] }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const en = getPublicLocale((await searchParams).lang) === "en";
  return {
    title: en ? "Explore Africa through YeYamo" : "Explorer l’Afrique à travers YeYamo.",
    description: en ? "Discover places, culture and local experiences across Africa with YeYamo." : "Découvrez les lieux, la culture et les expériences locales en Afrique avec YeYamo."
  };
}
export default async function Home({ searchParams }: Props) {
  const locale = getPublicLocale((await searchParams).lang);
  return <PublicLanguageProvider locale={locale}><LandingIntro><HomeContent /></LandingIntro></PublicLanguageProvider>;
}
