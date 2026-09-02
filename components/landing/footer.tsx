import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { socialItems } from "./data";

export function LandingFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <a className="site-footer__brand-link" href="#top">
            <Image
              src="/brand/yeyamo-logo.png"
              alt="YeYamo"
              width={48}
              height={48}
              className="site-footer__brand-mark"
            />
            <span>YeYamo</span>
          </a>
          <p className="site-footer__lead">
            Explorer, partager et valoriser le Cameroun avec une expérience claire, humaine et
            immersive.
          </p>

          <div className="site-footer__socials" aria-label="Réseaux sociaux">
            {socialItems.map((item) => (
              <a key={item.label} href="#top" className="site-footer__social">
                <span>{item.short}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__column">
          <h3>Navigation</h3>
          <a href="#features">Fonctionnalités</a>
          <a href="#solutions">Solutions</a>
          <a href="#roles">Rôles</a>
          <a href="#security">Sécurité</a>
          <a href="#about">À propos</a>
          <a href="#documentation">Documentation</a>
        </div>

        <div className="site-footer__column">
          <h3>Ressources</h3>
          <Link href="/">Guides</Link>
          <Link href="/">Blog</Link>
          <a href="#documentation">Documentation</a>
          <Link href="/">FAQ</Link>
        </div>

        <div className="site-footer__column">
          <h3>Contact</h3>
          <a href="mailto:hello@yeyamo.cm">hello@yeyamo.cm</a>
          <a href="tel:+237658940985">658940985</a>
          <a href="tel:+237676219440">676219440</a>
          <Link href="/">Yaoundé, Cameroun</Link>
        </div>

        <div className="site-footer__column site-footer__column--about">
          <h3>À propos</h3>
          <p>
            Une plateforme pensée pour inspirer la découverte et donner de la visibilité aux
            expériences locales.
          </p>
          <a href="#top" className="site-footer__backtop">
            Retour en haut
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 YeYamo. Tous droits réservés.</p>
        <div className="site-footer__bottom-links">
          <a href="#security">Sécurité</a>
          <a href="#about">À propos</a>
          <a href="#documentation">Documentation</a>
        </div>
      </div>
    </footer>
  );
}

