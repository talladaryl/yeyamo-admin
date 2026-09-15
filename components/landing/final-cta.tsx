"use client";

import { usePublicLanguage } from "./public-language";
import Image from "next/image";
import { Download } from "lucide-react";

export function FinalCta() {
  const { t } = usePublicLanguage();
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__art" aria-hidden="true">
        <Image src="/mascot/yamo.png" alt="" width={250} height={314} className="final-cta__mascot" />
      </div>

      <div className="final-cta__copy">
        <span>{t("VOTRE PROCHAINE ESCALE")}</span>
        <h2 id="final-cta-title">{t("Le voyage commence maintenant.")}</h2>
        <p>{t("Emportez YeYamo avec vous et laissez le Cameroun vous surprendre.")}</p>
      </div>
      <a className="final-cta__button" href="#section-telechargement">{t("Télécharger l’app")}<Download size={18} aria-hidden="true" /></a>
    </section>
  );
}
