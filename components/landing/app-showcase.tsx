import Image from "next/image";
import { appFeatures } from "./data";
import { SectionHeading } from "./section-heading";
import { SectionIcon } from "./section-icon";
import type { AppFeature } from "./types";

function AppFeatureRow({ title, description, icon }: AppFeature) {
  return (
    <li className="app-feature">
      <SectionIcon icon={icon} className="app-feature__icon" />
      <div>
        <h3 className="app-feature__title">{title}</h3>
        <p className="app-feature__text">{description}</p>
      </div>
    </li>
  );
}

export function AppShowcaseSection() {
  return (
    <section className="app-showcase" id="app-showcase" aria-labelledby="app-showcase-title">
      <div className="app-showcase__copy">
        <SectionHeading
          id="app-showcase-title"
          badge="MULTI-APPAREILS"
          title={
            <>
              Une expérience fluide <span>sur tous vos appareils</span>
            </>
          }
          description="YeYamo est disponible sur mobile et bientôt sur tablette et web pour vous suivre partout."
        />       

        <div className="store-buttons">
          <a
            href="#download"
            className="app-download__store-link"
            aria-label="Télécharger sur Google Play"
          >
            <Image
              src="/brand/google-play-badge.svg"
              alt="Télécharger sur Google Play"
              width={176}
              height={58}
              priority={false}
              className="app-download__badge"
            />
          </a>
          <a
            href="#download"
            className="app-download__store-link"
            aria-label="Télécharger sur l'App Store"
          >
            <Image
              src="/brand/app-store-badge.svg"
              alt="Télécharger sur l'App Store"
              width={176}
              height={58}
              priority={false}
              className="app-download__badge"
            />
          </a>
        </div>
      </div>

      <div className="app-showcase__devices" aria-label="Aperçu multi-appareils">
        <div className="app-showcase__device app-showcase__device--rear">
          <Image
            src="/landing/app-mobile-explorer.png"
            alt="Exploration mobile YeYamo"
            fill
            sizes="(max-width: 768px) 38vw, 14rem"
            className="hero-stage__image"
          />
        </div>
        <div className="app-showcase__device app-showcase__device--front">
          <Image
            src="/landing/app-mobile-home.png"
            alt="Accueil mobile YeYamo"
            fill
            sizes="(max-width: 768px) 38vw, 14rem"
            className="hero-stage__image"
          />
        </div>
        <div className="app-showcase__tablet">
          <Image
            src="/landing/app-dashboard.png"
            alt="Dashboard YeYamo"
            fill
            sizes="(max-width: 1100px) 90vw, 36vw"
            className="hero-stage__image"
          />
        </div>
      </div>

      <ul className="app-features" aria-label="Avantages de l'application">
        {appFeatures.map((item) => (
          <AppFeatureRow key={item.title} {...item} />
        ))}
      </ul>
    </section>
  );
}
