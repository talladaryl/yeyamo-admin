"use client";

import { usePublicLanguage } from "./public-language";
import Image from "next/image";

export function FinalCta() {
  const { t } = usePublicLanguage();
  return (
    <section className="final-cta" aria-label={t("Appel à l'action final")}>
      <div className="final-cta__art" aria-hidden="true">
        <div className="final-cta__sun" />
        <div className="final-cta__wave" />
        <Image src="/mascot/yamo.png" alt="" width={250} height={314} className="final-cta__mascot" />
      </div>

      <div className="final-cta__copy">
        <h2>{t("Prêt à explorer le Cameroun autrement ?")}</h2>
        <p>{t("Rejoignez YeYamo et vivez des expériences uniques dès aujourd'hui.")}</p>
      </div>
    </section>
  );
}
