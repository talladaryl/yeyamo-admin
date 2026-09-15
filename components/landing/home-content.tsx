"use client";
import { LandingHeader } from "./landing-header";
import { Hero } from "./hero";
import { LandingFooter } from "./footer";
import { PublicSectionContent } from "./public-section-page";
import { LandingNavigationProvider } from "./public-language";
import { SectionAnimations } from "./section-animations";
import { publicPages, type PublicPageSlug } from "@/lib/public/pages";
import "./public-pages.css";
export default function HomeContent() {
  return <LandingNavigationProvider><div className="public-home" id="top"><LandingHeader /><main id="main-content"><Hero />
    <SectionAnimations>{(Object.keys(publicPages) as PublicPageSlug[]).map((page) => <section className="landing-joined-section" id={`section-${page}`} aria-labelledby={`section-${page}-title`} key={page}><PublicSectionContent page={page} embedded /></section>)}</SectionAnimations>
  </main><LandingFooter /></div></LandingNavigationProvider>;
}
