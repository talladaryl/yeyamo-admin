"use client";
import { ArrowRight, Compass, HeartHandshake, Landmark } from "lucide-react";
import { usePublicLanguage } from "./public-language";
import { SectionBadge } from "./section-heading";
import Image from "next/image";
import { communityTestimonials } from "./data";
const contributions = [
  { icon: Compass, title: "Vos découvertes", text: "Partagez un lieu, un récit ou un conseil issu de votre expérience." },
  { icon: Landmark, title: "Le regard local", text: "Faites connaître les savoir-faire, les traditions et les initiatives de votre région." },
  { icon: HeartHandshake, title: "Des échanges respectueux", text: "Publiez des informations utiles, respectez les personnes et protégez leur vie privée." }
];
export function CommunitySection() {
  const { t, href } = usePublicLanguage();
  return <><section className="community-editorial" id="community" aria-labelledby="community-title">
    <div className="community-editorial__intro">
      <SectionBadge>{t("COMMUNAUTÉ")}</SectionBadge>
      <h2 id="community-title">{t("Une communauté, des regards multiples.")}</h2>
      <p>{t("Voyageurs, créateurs et acteurs locaux partagent une même envie : faire découvrir les lieux et les histoires qui comptent.")}</p>
      <p>{t("Chaque contribution apporte un point de vue. Ensemble, donnons plus de place aux expériences locales.")}</p>
      <a href={href("/documentation#contribute")}>{t("Découvrir comment contribuer")}<ArrowRight size={18} aria-hidden="true" /></a>
    </div>
    <div className="community-editorial__cards">{contributions.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={24} aria-hidden="true" /><div><h3>{t(title)}</h3><p>{t(text)}</p></div></article>)}</div>
  </section>
  <section className="community-testimonials" aria-labelledby="testimonials-title">
    <SectionBadge>{t("TÉMOIGNAGES")}</SectionBadge>
    <h2 id="testimonials-title">{t("Des expériences à partager")}</h2>
    <div className="community-testimonials__grid">{communityTestimonials.map((person) => <figure key={person.name}>
      <blockquote><p>« {t(person.quote)} »</p></blockquote>
      <figcaption><Image src={person.avatar} alt="" width={48} height={48} /><span><strong>{person.name}</strong><small>{t(person.role)}</small></span></figcaption>
    </figure>)}</div>
  </section></>;
}
