import { LandingHeader } from "../components/landing/landing-header";
import { Hero } from "../components/landing/hero";
import { FeaturesSection } from "../components/landing/features";
import { InfoSection } from "../components/landing/info-grid";
import { DestinationsSection } from "../components/landing/destinations";
import { CommunitySection } from "../components/landing/community";
import { AppShowcaseSection } from "../components/landing/app-showcase";
import { AppDownloadSection, APP_STORE_URL, PLAY_STORE_URL } from "../components/landing/app-download";
import { FaqSection } from "../components/landing/faq";
import { FinalCta } from "../components/landing/final-cta";
import { LandingFooter } from "../components/landing/footer";

export default function Home() {
  return (
    <main className="landing-page" id="top">
      <LandingHeader />
      <Hero />
      <FeaturesSection />
      <InfoSection
        id="roles"
        badge="RÔLES"
        title={
          <>
            Des accès adaptés <span>à chaque profil</span>
          </>
        }
        description="YeYamo organise les usages pour que chaque personne voie ce qui lui est utile, sans surcharge."
        section="roles"
      />
      <DestinationsSection />
      <CommunitySection />
      <InfoSection
        id="security"
        badge="SÉCURITÉ"
        title={
          <>
            Confiance, protection <span>et contrôle</span>
          </>
        }
        description="La plateforme privilégie des protections lisibles pour les données, les paiements et les accès."
        section="security"
      />
      <AppShowcaseSection />
      <InfoSection
        id="about"
        badge="À PROPOS"
        title={
          <>
            Une mission simple : <span>mieux découvrir</span>
          </>
        }
        description="YeYamo rassemble découverte, culture et confiance pour mettre les expériences locales au premier plan."
        section="about"
      />
      <FaqSection />
      <InfoSection
        id="documentation"
        badge="DOCUMENTATION"
        title={
          <>
            Des ressources <span>pour aller vite</span>
          </>
        }
        description="Guides, aide et accès API sont regroupés ici pour accompagner l’usage au quotidien."
        section="documentation"
      />
      <FinalCta />
      <AppDownloadSection
        headline="Téléchargez l'app YeYamo"
        subheadline="Retrouvez YeYamo sur mobile pour explorer, sauvegarder et partager vos découvertes à tout moment."
        appStoreUrl={APP_STORE_URL}
        playStoreUrl={PLAY_STORE_URL}
      />
      <LandingFooter />
    </main>
  );
}
