"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BookmarkCheck, Compass, HeartHandshake, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { usePublicLanguage } from "./public-language";

const trustItems = [
  { icon: MapPinned, title: "Des repères locaux", text: "Des lieux, événements et récits ancrés dans le territoire." },
  { icon: BookmarkCheck, title: "Un voyage à votre rythme", text: "Gardez vos idées et préparez vos prochaines étapes." },
  { icon: ShieldCheck, title: "Une expérience encadrée", text: "Des outils clairs pour explorer et partager avec confiance." }
] as const;

const steps = [
  { number: "01", icon: Compass, title: "Découvrez ce qui vous ressemble", text: "Parcourez des lieux, des cultures et des expériences qui donnent une autre profondeur au voyage.", image: "/landing/decouv.png", alt: "Écran Découverte de YeYamo", direction: -1 },
  { number: "02", icon: BookmarkCheck, title: "Préparez sans perdre l’inspiration", text: "Repérez vos favoris, composez votre parcours et gardez les informations utiles au même endroit.", image: "/landing/explorer.png", alt: "Écran Explorer de YeYamo", direction: 1 },
  { number: "03", icon: HeartHandshake, title: "Vivez et partagez autrement", text: "Rencontrez les histoires locales, contribuez à la communauté et transmettez vos découvertes.", image: "/landing/app-mobile-home.png", alt: "Accueil mobile de YeYamo", direction: -1 }
] as const;

export function TrustStrip() {
  const { t } = usePublicLanguage();
  return <section className="trust-strip" aria-label={t("Les engagements YeYamo")}>
    <div className="trust-strip__inner">{trustItems.map(({ icon: Icon, title, text }) => <article key={title}><Icon aria-hidden="true" size={24} /><div><h2>{t(title)}</h2><p>{t(text)}</p></div></article>)}</div>
  </section>;
}

export function JourneySection() {
  const { t } = usePublicLanguage();
  return <section className="journey story-section" id="section-solutions" aria-labelledby="journey-title">
    <header className="story-heading"><span>{t("VOTRE PARCOURS")}</span><h2 id="journey-title">{t("De l’envie au souvenir, YeYamo vous accompagne.")}</h2><p>{t("Trois temps simples pour transformer une idée de sortie en expérience qui compte.")}</p></header>
    <div className="journey__steps">{steps.map((step, index) => {
      const Icon = step.icon;
      return <motion.article key={step.number} className={`journey-step journey-step--${index + 1}`} initial={{ opacity: 0, x: step.direction * 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .3 }}>
        <div className="journey-step__copy"><span className="journey-step__number">{step.number}</span><Icon aria-hidden="true" size={24} /><h3>{t(step.title)}</h3><p>{t(step.text)}</p></div>
        <div className="journey-step__visual"><span aria-hidden="true" /><Image src={step.image} alt={t(step.alt)} fill sizes="(max-width: 767px) 72vw, 300px" /></div>
        {index === 1 && <motion.div className="journey-step__yamo" aria-hidden="true" initial={{ opacity: 0, rotate: -8, y: 18 }} whileInView={{ opacity: 1, rotate: 3, y: 0 }} viewport={{ once: true }}><Image src="/mascot/yamo.png" alt="" fill sizes="180px" /></motion.div>}
      </motion.article>;
    })}</div>
    <Sparkles className="journey__mark" aria-hidden="true" />
  </section>;
}
