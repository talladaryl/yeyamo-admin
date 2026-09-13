"use client";

import { ArrowUpRight } from "lucide-react";
import { LandingHeader } from "./landing-header";
import { LandingFooter } from "./footer";
import { PublicHeroBackground } from "./public-hero-background";
import { usePublicLanguage } from "./public-language";
import { publicPages, type PublicPageSlug } from "@/lib/public/pages";
import { FeaturesSection } from "./features";
import { SolutionsStrip } from "./solutions-strip";
import { InfoGrid } from "./info-grid";
import { aboutCards, rolesCards, securityCards } from "./data";
import { DestinationsSection } from "./destinations";
import { CommunitySection } from "./community";
import { AppShowcaseSection } from "./app-showcase";
import { AppDownloadSection, APP_STORE_URL, PLAY_STORE_URL } from "./app-download";
import { FaqSection } from "./faq";
import "./public-pages.css";

export function PublicSectionPage({ page }: { page: PublicPageSlug }) {
  const { locale, t, href } = usePublicLanguage();
  return (
    <div className="public-section-page" id="top">
      <LandingHeader />
      <main id="main-content">
        <header className="public-section-heading">
          <PublicHeroBackground page={page} />
          <p>YEYAMO / {publicPages[page][locale]}</p>
          <h1>{publicPages[page][locale]}</h1>
        </header>
        <div className="public-section-body">
          {page === "fonctionnalites" && <FeaturesSection showSolutions={false} />}
          {page === "solutions" && <SolutionsStrip />}
          {page === "profils" && <InfoGrid items={rolesCards} />}
          {page === "destinations" && <DestinationsSection />}
          {page === "communaute" && <CommunitySection />}
          {page === "securite" && <><InfoGrid items={securityCards} /><a className="public-section-more" href={href("/confidentialite")}>{t("Politique de confidentialité")}<ArrowUpRight size={18} aria-hidden="true" /></a></>}
          {page === "application" && <AppShowcaseSection />}
          {page === "a-propos" && <InfoGrid items={aboutCards} />}
          {page === "faq" && <FaqSection />}
          {page === "telechargement" && <AppDownloadSection headline={t("Retrouvez YeYamo sur mobile")} subheadline={t("Explorez les possibilités de l’application et retrouvez ici ses liens de téléchargement officiels.")} appStoreUrl={APP_STORE_URL} playStoreUrl={PLAY_STORE_URL} />}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
