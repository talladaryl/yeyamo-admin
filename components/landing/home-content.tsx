"use client";
import { LandingHeader } from "./landing-header";
import { Hero } from "./hero";
import { LandingFooter } from "./footer";
import { LandingNavigationProvider } from "./public-language";
import { SectionAnimations } from "./section-animations";
import { FeaturesSection } from "./features";
import { DestinationsSection } from "./destinations";
import { CommunitySection } from "./community";
import { AppShowcaseSection } from "./app-showcase";
import { AppDownloadSection, APP_STORE_URL, PLAY_STORE_URL } from "./app-download";
import { FaqSection } from "./faq";
import { InfoGrid } from "./info-grid";
import { securityCards } from "./data";
import { FinalCta } from "./final-cta";
import { JourneySection, TrustStrip } from "./journey-sections";
import { usePublicLanguage } from "./public-language";
import Link from "next/link";
import "./public-pages.css";
import "./landing-refresh.css";
export default function HomeContent() {
  return <LandingNavigationProvider><LandingExperience /></LandingNavigationProvider>;
}

function LandingExperience() {
  const { t } = usePublicLanguage();
  return <div className="public-home landing-experience" id="top">
    <LandingHeader />
    <main id="main-content">
      <Hero />
      <SectionAnimations>
        <TrustStrip />
        <JourneySection />
        <section className="story-section story-section--features" id="section-fonctionnalites" aria-labelledby="features-heading">
          <header className="story-heading"><span>{t("FONCTIONNALITÉS")}</span><h2 id="features-heading">{t("Tout ce qu’il faut pour partir plus loin.")}</h2><p>{t("Une expérience pensée pour découvrir, choisir et garder le meilleur du Cameroun à portée de main.")}</p></header>
          <FeaturesSection showSolutions={false} />
        </section>
        <section className="story-section story-section--destinations" id="section-destinations"><DestinationsSection /></section>
        <section className="story-section story-section--application" id="section-application"><AppShowcaseSection /></section>
        <section className="story-section story-section--community" id="section-communaute"><CommunitySection /></section>
        <section className="story-section story-section--security" id="section-securite" aria-labelledby="security-heading">
          <div className="security-layout"><header className="story-heading story-heading--left"><span>{t("CONFIANCE")}</span><h2 id="security-heading">{t("Voyagez l’esprit plus léger.")}</h2><p>{t("Trois repères essentiels pour protéger vos échanges, vos informations et vos parcours.")}</p><Link className="text-link" href="/securite">{t("Voir nos engagements de sécurité")}</Link></header><InfoGrid items={securityCards.slice(0, 3)} /></div>
        </section>
        <section className="story-section story-section--faq" id="section-faq"><FaqSection /></section>
        <section className="story-section story-section--download" id="section-telechargement"><AppDownloadSection headline={t("Le Cameroun tient dans votre poche.")} subheadline={t("Téléchargez YeYamo et commencez votre prochaine découverte depuis votre mobile.")} appStoreUrl={APP_STORE_URL} playStoreUrl={PLAY_STORE_URL} /></section>
        <FinalCta />
      </SectionAnimations>
    </main>
    <LandingFooter />
  </div>;
}
