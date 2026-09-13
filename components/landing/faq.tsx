"use client";

import { usePublicLanguage } from "./public-language";
import { ChevronRight } from "lucide-react";
import { faqItems } from "./data";
import { SectionHeading } from "./section-heading";

export function FaqSection() {
  const { t } = usePublicLanguage();
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <SectionHeading
        id="faq-title"
        badge={t("FAQ")}
        title={
          <>
            {t("Questions ")}<span>{t("fréquentes")}</span>
          </>
        }
        description={t("Voici les réponses aux questions les plus utiles avant de découvrir la plateforme.")}
      />

      <div className="faq__list">
        {faqItems.map((item) => (
          <details key={item.question} className="faq-item">
            <summary className="faq-item__summary">
              <span>{t(item.question)}</span>
              <ChevronRight aria-hidden="true" size={16} className="faq-item__icon" />
            </summary>
            <div className="faq-item__content">
              <p>{t(item.answer)}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

