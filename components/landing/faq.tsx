import { ChevronRight } from "lucide-react";
import { faqItems } from "./data";
import { SectionHeading } from "./section-heading";

export function FaqSection() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <SectionHeading
        id="faq-title"
        badge="FAQ"
        title={
          <>
            Questions <span>fréquentes</span>
          </>
        }
        description="Voici les réponses aux questions les plus utiles avant de découvrir la plateforme."
      />

      <div className="faq__list">
        {faqItems.map((item) => (
          <details key={item.question} className="faq-item">
            <summary className="faq-item__summary">
              <span>{item.question}</span>
              <ChevronRight aria-hidden="true" size={16} className="faq-item__icon" />
            </summary>
            <div className="faq-item__content">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

