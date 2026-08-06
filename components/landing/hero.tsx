"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Store, MapPin, Users, type LucideIcon } from "lucide-react";
import {
  heroBadgeMotion,
  heroBodyMotion,
  heroCtaMotion,
  heroFloatMotion,
  heroHaloMotion,
  heroHeadlineLineMotion,
  heroLineStagger,
  heroMiniBenefitsMotion,
  heroPanelMotion,
  heroTitleMotion,
  heroVisualMotion
} from "../../lib/public/animations";
import { heroBenefits } from "./data";
import { SectionIcon } from "./section-icon";
import { YamoScrollGuide } from "./yamo-scroll-guide";

function FloatingCard({
  title,
  subtitle,
  value,
  icon,
  className,
  reducedMotion
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: LucideIcon;
  className: string;
  reducedMotion: boolean;
}) {
  const Icon = icon;

  return (
    <motion.div
      className={`floating-card ${className}`}
      animate={reducedMotion ? { opacity: 1 } : heroFloatMotion}
      transition={
        reducedMotion ? { duration: 0.18 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <span className="floating-card__icon">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div className="floating-card__copy">
        <p className="floating-card__title">{title}</p>
        <p className="floating-card__subtitle">{subtitle}</p>
      </div>
      <p className="floating-card__value">{value}</p>
    </motion.div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const sectionIds = ["features", "solutions", "roles", "security", "about", "documentation"];

  return (
    <section className="hero" aria-label="Présentation de YeYamo">
      <div className="hero__inner">
        <motion.div
          className="hero__copy"
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroLineStagger}
        >
          <motion.span
            className="hero__badge"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroBadgeMotion}
          >
            DÉCOUVREZ LE CAMEROUN AUTREMENT
          </motion.span>

          <motion.h1
            className="hero__title"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroTitleMotion}
          >
            <motion.span variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroHeadlineLineMotion}>
              Explorez le Cameroun
            </motion.span>
            <motion.span
              className="hero__title-accent"
              variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroHeadlineLineMotion}
            >
              en toute liberté
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero__lead"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroBodyMotion}
          >
            Découvrez des lieux uniques, vivez la culture locale, partagez vos expériences et
            rejoignez une communauté passionnée par le Cameroun.
          </motion.p>

          <motion.div
            className="hero__actions"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroCtaMotion}
          >
            <a className="button button--primary" href="#download">
              <span>Télécharger l&apos;app</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
            </a>
            <a className="button button--secondary" href="#about">
              <Play aria-hidden="true" size={17} fill="currentColor" strokeWidth={1.8} />
              <span>Découvrir YeYamo</span>
            </a>
          </motion.div>

          <motion.div
            className="hero__benefits"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroMiniBenefitsMotion}
          >
            {heroBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article key={benefit.title} className="hero-benefit">
                  <SectionIcon icon={Icon} className="hero-benefit__icon" />
                  <div>
                    <h2 className="hero-benefit__title">{benefit.title}</h2>
                    <p className="hero-benefit__text">{benefit.text}</p>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </motion.div>

        <div className="hero__visual" aria-label="Aperçu de l'application YeYamo">
          <motion.div
            className="hero-stage"
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroVisualMotion}
          >
            <motion.div
              className="hero-stage__backdrop"
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : heroHaloMotion}
              transition={shouldReduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <FloatingCard
              className="floating-card--community"
              title="Communauté YeYamo"
              subtitle="Partages, vérifiés et retours terrain"
              value="12,8k membres"
              icon={Users}
              reducedMotion={!!shouldReduceMotion}
            />
            <FloatingCard
              className="floating-card--local"
              title="Expérience locale"
              subtitle="Culture, artisanat et itinéraires"
              value="4 min pour explorer"
              icon={Store}
              reducedMotion={!!shouldReduceMotion}
            />
            <FloatingCard
              className="floating-card--popular"
              title="Lieu populaire"
              subtitle="Douala, Kribi et Yaoundé"
              value="Créé par la communauté"
              icon={MapPin}
              reducedMotion={!!shouldReduceMotion}
            />

            <motion.div
              className="hero-stage__dashboard"
              variants={shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : heroPanelMotion}
              transition={shouldReduceMotion ? { duration: 0.18 } : { duration: 0.8, delay: 0.08 }}
            >
              <div className="hero-stage__dashboard-screen">
                <Image
                  src="/landing/app-dashboard.png"
                  alt="Tableau de bord YeYamo"
                  fill
                  priority
                  sizes="(max-width: 1100px) 92vw, 50vw"
                  className="hero-stage__image"
                />
              </div>
            </motion.div>

            <motion.div
              className="hero-stage__halo hero-stage__halo--left"
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : heroHaloMotion}
              transition={shouldReduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="hero-stage__halo hero-stage__halo--right"
              aria-hidden="true"
              animate={shouldReduceMotion ? undefined : heroHaloMotion}
              transition={shouldReduceMotion ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <YamoScrollGuide sectionIds={sectionIds} className="hero-stage__mascot-guide" />
          </motion.div>
        </div>
      </div>

      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 280" preserveAspectRatio="none">
          <path d="M0 155C104 92 214 58 334 69C470 82 573 155 715 148C856 141 945 67 1070 46C1188 26 1320 62 1440 37V280H0Z" fill="rgba(255,244,245,0.9)" />
          <path d="M0 182C106 118 230 93 348 106C465 119 560 177 711 171C867 165 932 82 1062 63C1189 45 1327 82 1440 55V280H0Z" fill="#e0151f" />
          <path d="M0 206C100 169 194 158 296 170C425 186 542 248 671 241C812 234 893 171 1008 154C1152 133 1296 168 1440 141V280H0Z" fill="#b80612" />
        </svg>
      </div>
    </section>
  );
}
