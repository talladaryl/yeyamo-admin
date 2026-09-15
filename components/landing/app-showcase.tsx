"use client";

import { usePublicLanguage } from "./public-language";
import Image from "next/image";
import { appFeatures } from "./data";
import { StoreBadge, APP_STORE_URL, PLAY_STORE_URL } from "./app-download";
import { SectionHeading } from "./section-heading";
import { SectionIcon } from "./section-icon";
import type { AppFeature } from "./types";

function AppFeatureRow({ title, description, icon }: AppFeature) {
  const { t } = usePublicLanguage();
  return (
    <li className="app-feature">
      <SectionIcon icon={icon} className="app-feature__icon" />
      <div>
        <h3 className="app-feature__title">{t(title)}</h3>
        <p className="app-feature__text">{t(description)}</p>
      </div>
    </li>
  );
}

export function AppShowcaseSection() {
  const { t } = usePublicLanguage();
  return (
    <section className="app-showcase" id="app-showcase" aria-labelledby="app-showcase-title">
      <div className="app-showcase__copy">
        <SectionHeading
          id="app-showcase-title"
          badge={t("MULTI-APPAREILS")}
          title={
            <>
              {t("Une expérience fluide ")}<span>{t("sur tous vos appareils")}</span>
            </>
          }
          description={t("YeYamo est disponible sur mobile et bientôt sur tablette et web pour vous suivre partout.")}
        />       

        <div className="store-buttons app-download__badges" aria-label={t("Badges de téléchargement")}>
          <StoreBadge url={APP_STORE_URL} store="apple" />
          <StoreBadge url={PLAY_STORE_URL} store="google" />
        </div>
      </div>

      <div className="app-showcase__devices app-showcase__captures" aria-label={t("Aperçu multi-appareils")}>
        <div className="app-showcase__capture">
          <Image src="/landing/event.png" alt={t("Écran Événements de YeYamo")} fill sizes="(max-width: 700px) 43vw, 250px" />
        </div>
        <div className="app-showcase__capture">
          <Image src="/landing/config.png" alt={t("Écran de personnalisation de YeYamo")} fill sizes="(max-width: 700px) 43vw, 250px" />
        </div>
      </div>
      <ul className="app-features" aria-label={t("Avantages de l'application")}>
        {appFeatures.map((item) => (
          <AppFeatureRow key={item.title} {...item} />
        ))}
      </ul>
    </section>
  );
}
