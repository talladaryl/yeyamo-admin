"use client";
import { MascotAnimation } from "./mascot-animation";
import Image from "next/image";
import { ArrowRight, Compass, MapPin } from "lucide-react";
import { usePublicLanguage } from "./public-language";
import { PublicHeroBackground } from "./public-hero-background";
export function Hero() {
  const { t, href } = usePublicLanguage();
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <PublicHeroBackground />
      <div className="home-hero__inner">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow"><Compass size={16} aria-hidden="true" />{t("L’AFRIQUE, AU PLUS PRÈS")}</span>
          <h1 id="home-title" tabIndex={-1}>{t("Explorer l’Afrique")}{" "}<span>{t("à travers YeYamo.")}</span></h1>
          <p className="home-hero__lead">{t("Des lieux qui inspirent. Des cultures qui rapprochent. Découvrez l’Afrique à travers les personnes qui la font vivre.")}</p>
          <div className="home-hero__actions">
            <a className="button button--primary" href={href("/destinations")}>{t("Explorer les destinations")}<ArrowRight size={18} aria-hidden="true" /></a>
            <a className="home-hero__secondary" href={href("/application")}>{t("Découvrir l’application")}<ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="home-hero__note"><MapPin size={16} aria-hidden="true" /><span>{t("Premières escales au Cameroun. Un regard ouvert sur l’Afrique.")}</span></div>
        </div>
        <div className="home-hero__visual home-hero__visual--screens" aria-label={t("Aperçu de l’application et mascotte Yamo")}>
          <div className="home-hero__capture home-hero__capture--first"><Image src="/landing/decouv.png" alt={t("Écran Découverte de YeYamo")} fill priority sizes="(max-width: 700px) 42vw, 230px" /></div>
          <div className="home-hero__capture home-hero__capture--second"><Image src="/landing/explorer.png" alt={t("Écran Explorer de YeYamo")} fill priority sizes="(max-width: 700px) 42vw, 230px" /></div>
          <div className="home-hero__mascot"><MascotAnimation /></div>
          <span className="home-hero__visual-caption">{t("Votre prochaine découverte commence ici.")}</span>
        </div>
      </div>
    </section>
  );
}
