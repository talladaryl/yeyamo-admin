"use client";

import { usePublicLanguage } from "./public-language";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function LandingFooter() {
  const { t, href } = usePublicLanguage();
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <a className="site-footer__brand-link" href="#top">
            <Image
              src="/brand/yeyamo-logo.png"
              alt={t("YeYamo")}
              width={48}
              height={48}
              className="site-footer__brand-mark"
            />
            <span>{t("YeYamo")}</span>
          </a>
          <p className="site-footer__lead">
            {t("Explorer, partager et valoriser le Cameroun avec une expérience claire, humaine et immersive.")}</p>

        </div>

        <div className="site-footer__column">
          <h3>{t("Navigation")}</h3>
          <a href={href("/fonctionnalites")}>{t("Fonctionnalités")}</a>
          <a href={href("/solutions")}>{t("Solutions")}</a>
          <a href={href("/profils")}>{t("Rôles")}</a>
          <a href={href("/securite")}>{t("Sécurité")}</a>
          <a href={href("/a-propos")}>{t("À propos")}</a>
          <a href={href("/documentation")}>{t("Documentation")}</a>
        </div>

        <div className="site-footer__column">
          <h3>{t("Ressources")}</h3>
          <a href={href("/documentation#getting-started")}>{t("Guides")}</a>
          <a href={href("/confidentialite")}>{t("Politique de confidentialité")}</a>
          <a href={href("/documentation")}>{t("Documentation")}</a>
          <a href={href("/faq")}>{t("FAQ")}</a>
          <a href={href("/application")}>{t("Application")}</a>
          <a href={href("/telechargement")}>{t("Télécharger")}</a>
        </div>

        <div className="site-footer__column">
          <h3>{t("Contact")}</h3>
          <a href="mailto:Support@yeyamo.com">Support@yeyamo.com</a>
          <a href="tel:+237658940985">{t("+237 658 940 985")}</a>
          <a href="tel:+237676219440">{t("+237 676 219 440")}</a>
          <a href={href("/")}>{t("Yaoundé, Cameroun")}</a>
        </div>

        <div className="site-footer__column site-footer__column--about">
          <h3>{t("À propos")}</h3>
          <p>
            {t("Une plateforme pensée pour inspirer la découverte et donner de la visibilité aux expériences locales.")}</p>
          <a href="#top" className="site-footer__backtop">
            {t("Retour en haut")}<ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>{t("© 2026 YeYamo. Tous droits réservés.")}</p>
        <div className="site-footer__bottom-links">
          <a href={href("/confidentialite")}>{t("Politique de confidentialité")}</a>
          <a href={href("/securite")}>{t("Sécurité")}</a>
          <a href={href("/a-propos")}>{t("À propos")}</a>
          <a href={href("/documentation")}>{t("Documentation")}</a>
        </div>
      </div>
    </footer>
  );
}
