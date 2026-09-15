"use client";

import { usePublicLanguage } from "./public-language";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, Menu } from "lucide-react";
import { LanguageSwitcher } from "./public-language";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "./data";
import "./public-navigation.css";
import { AnimatedLogo } from "../animated-logo";

const primaryPaths = new Set(["/fonctionnalites", "/destinations", "/communaute", "/faq"]);
const primaryItems = navItems.filter((item) => primaryPaths.has(item.href));
export function LandingHeader() {
  const { t, href } = usePublicLanguage();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = primaryItems
      .map((item) => document.getElementById(`section-${item.href.slice(1)}`))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id.replace("section-", ""));
    }, { rootMargin: "-28% 0px -55%", threshold: [0, .2, .5, .8] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href={href("/")} aria-label={t("YeYamo — Accueil")}>
          <AnimatedLogo compact className="site-header__animated-logo" />
        </a>

        <nav className="site-header__nav" aria-label={t("Navigation principale")}>
          {primaryItems.map((item) => {
            const active = pathname === "/" ? activeSection === item.href.slice(1) : pathname === item.href;
            return <a key={item.label} href={pathname === "/" ? `#section-${item.href.slice(1)}` : href(item.href)} className="site-header__nav-link" aria-current={active ? "location" : undefined} onClick={() => setActiveSection(item.href.slice(1))}>
              {active ? <motion.span className="site-header__drop" layoutId="active-navigation-drop" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden="true" /> : null}
              <span className="site-header__nav-label">{t(item.label)}</span>
            </a>
          })}
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />
          <a className="site-header__cta" href="#section-telechargement">{t("Télécharger l’app")}<Download size={17} aria-hidden="true" /></a>

          <button
            type="button"
            className="site-header__menu"
            aria-label={t(mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu")}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <ChevronDown aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="site-header__drawer"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.2 }}
          >
            <div className="site-header__drawer-links">
              {primaryItems.map((item) => (
                <a
                  key={item.label}
                  href={pathname === "/" ? `#section-${item.href.slice(1)}` : href(item.href)}
                  className="site-header__drawer-link"
                  aria-current={(pathname === "/" ? activeSection === item.href.slice(1) : pathname === item.href) ? "location" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.label)}
                </a>
              ))}
            </div>
            <a className="site-header__drawer-cta" href="#section-telechargement" onClick={() => setMobileMenuOpen(false)}>{t("Télécharger l’app")}<Download size={17} aria-hidden="true" /></a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

