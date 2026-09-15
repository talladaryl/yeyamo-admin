"use client";
import { MascotAnimation } from "./mascot-animation";
import Image from "next/image";
import { ArrowDown, Download, MapPin } from "lucide-react";
import { usePublicLanguage } from "./public-language";
import { HeroVideoBackground } from "./hero-video-background";
export function Hero() {
  const { t } = usePublicLanguage();
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <HeroVideoBackground />
      <div className="home-hero__inner">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow"><MapPin size={16} aria-hidden="true" />{t("LE CAMEROUN, À PORTÉE DE MAIN")}</span>
          <h1 id="home-title" tabIndex={-1}>{t("Découvrez plus.")}<span>{t("Vivez chaque lieu.")}</span></h1>
          <p className="home-hero__lead">{t("YeYamo rassemble les lieux, les histoires et les expériences locales pour vous aider à explorer le Cameroun autrement.")}</p>
          <div className="home-hero__actions">
            <a className="button button--primary" href="#section-telechargement">{t("Télécharger l’app")}<Download size={18} aria-hidden="true" /></a>
            <a className="home-hero__secondary" href="#section-solutions">{t("Voir comment ça marche")}<ArrowDown size={16} aria-hidden="true" /></a>
          </div>
          <div className="home-hero__note"><span aria-hidden="true">01</span><p>{t("Votre guide mobile pour découvrir, préparer et partager.")}</p></div>
        </div>
        <div className="home-hero__visual home-hero__visual--screens" aria-label={t("Aperçu de l’application et mascotte Yamo")}>
          <div className="home-hero__capture home-hero__capture--first"><Image src="/landing/decouv.png" alt={t("Écran Découverte de YeYamo")} fill priority sizes="(max-width: 700px) 42vw, 230px" /></div>
          <div className="home-hero__capture home-hero__capture--second"><Image src="/landing/explorer.png" alt={t("Écran Explorer de YeYamo")} fill priority sizes="(max-width: 700px) 42vw, 230px" /></div>
          <div className="home-hero__mascot"><MascotAnimation /></div>
          <span className="home-hero__visual-caption">{t("Votre prochaine découverte commence dans l’app.")}</span>
        </div>
      </div>
    </section>
  );
}
