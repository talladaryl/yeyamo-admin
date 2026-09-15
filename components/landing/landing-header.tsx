"use client";

import { usePublicLanguage } from "./public-language";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import { LanguageSwitcher } from "./public-language";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "./data";
import "./public-navigation.css";

const primaryPaths = new Set(["/", "/fonctionnalites", "/destinations", "/communaute"]);
const expandedPaths = new Set(["/solutions", "/securite", "/application", "/telechargement"]);
const primaryItems = navItems.filter((item) => primaryPaths.has(item.href) || expandedPaths.has(item.href));
const additionalItems = navItems.filter((item) => !primaryPaths.has(item.href));
function subscribeHash(listener: () => void) {
  window.addEventListener("hashchange", listener);
  return () => window.removeEventListener("hashchange", listener);
}
function currentHash() { return window.location.hash; }

export function LandingHeader() {
  const { t, href } = usePublicLanguage();
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, currentHash, () => "");
  const activePath = pathname === "/" && hash.startsWith("#section-") ? `/${hash.slice(9)}` : pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href={href("/")} aria-label={t("YeYamo — Accueil")}>
          <Image
            src="/brand/yeyamo-logo.png"
            alt={t("YeYamo")}
            width={54}
            height={54}
            priority
            className="site-header__brand-mark"
          />
          <span className="site-header__brand-name">{t("YeYamo")}</span>
        </a>

        <nav className="site-header__nav" aria-label={t("Navigation principale")}>
          {primaryItems.map((item) => (
            <a key={item.label} href={href(item.href)} className={`site-header__nav-link${expandedPaths.has(item.href) ? " site-header__expanded-link" : ""}`} aria-current={activePath === item.href ? "page" : undefined}>
              {t(item.label)}
            </a>
          ))}
          {/* The native menu can be opened before React hydrates. */}
          <details suppressHydrationWarning className="site-header__more" onKeyDown={(event) => {
            if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); }
          }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.open = false; }}>
            <summary className="site-header__nav-link">{t("Toutes les pages")}<ChevronDown size={14} aria-hidden="true" /></summary>
            <div className="site-header__more-links">{additionalItems.map((item) => <a key={item.href} href={href(item.href)} className={expandedPaths.has(item.href) ? "site-header__overflow-link" : undefined} aria-current={activePath === item.href ? "page" : undefined}>{t(item.label)}</a>)}</div>
          </details>
        </nav>

        <div className="site-header__actions">
          <LanguageSwitcher />

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
            initial={shouldReduceMotion ? false : { opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.2 }}
          >
            <div className="site-header__drawer-links">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={href(item.href)}
                  className="site-header__drawer-link"
                  aria-current={activePath === item.href ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.label)}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

