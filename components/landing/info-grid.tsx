"use client";

import { usePublicLanguage } from "./public-language";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { SectionIcon } from "./section-icon";
import { aboutCards, documentationCards, rolesCards, securityCards } from "./data";
import type { InfoCard } from "./types";
import { ChevronRight } from "lucide-react";
import { createRevealVariants } from "../../lib/public/animations";

const revealVariants = createRevealVariants(24);
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
} as const;

const infoSections = {
  roles: rolesCards,
  security: securityCards,
  about: aboutCards,
  documentation: documentationCards
} as const;

export function InfoGrid({ items }: { items: InfoCard[] }) {
  const { href, t } = usePublicLanguage();
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? fadeVariants : revealVariants;

  return (
    <motion.div
      className="secondary-grid"
      initial="hidden"
      whileInView="visible"
      custom="up"
      viewport={{ once: true, amount: 0.2 }}
      variants={shouldReduceMotion ? fadeVariants : { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }}
    >
      {items.map((item) => {
        const Icon = item.icon;

        if (item.href) {
          return (
            <motion.a key={item.title} className="secondary-card" href={href(item.href)} variants={itemVariants} custom="up">
              <SectionIcon icon={Icon} className="secondary-card__icon" />
              <div className="secondary-card__copy">
                <h3 className="secondary-card__title">{t(item.title)}</h3>
                <p className="secondary-card__text">{t(item.description)}</p>
              </div>
              <ChevronRight aria-hidden="true" className="secondary-card__arrow" size={17} />
            </motion.a>
          );
        }

        return (
          <motion.article key={item.title} className="secondary-card" variants={itemVariants} custom="up">
            <SectionIcon icon={Icon} className="secondary-card__icon" />
            <div className="secondary-card__copy">
              <h3 className="secondary-card__title">{t(item.title)}</h3>
              <p className="secondary-card__text">{t(item.description)}</p>
            </div>
            <ChevronRight aria-hidden="true" className="secondary-card__arrow" size={17} />
          </motion.article>
        );
      })}
    </motion.div>
  );
}

export function InfoSection({
  id,
  badge,
  title,
  description,
  section
}: {
  id: string;
  badge: string;
  title: ReactNode;
  description: string;
  section: keyof typeof infoSections;
}) {
  const { t } = usePublicLanguage();
  return (
    <section className="faq" id={id} aria-labelledby={`${id}-title`}>
      <SectionHeading id={`${id}-title`} badge={t(badge)} title={t(title)} description={t(description)} />
      <InfoGrid items={infoSections[section]} />
    </section>
  );
}
