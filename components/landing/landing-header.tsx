"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { navItems } from "./data";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="YeYamo - retour en haut de page">
          <Image
            src="/brand/yeyamo-logo.png"
            alt="YeYamo"
            width={54}
            height={54}
            priority
            className="site-header__brand-mark"
          />
          <span className="site-header__brand-name">YeYamo</span>
        </a>

        <nav className="site-header__nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="site-header__nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link className="site-header__cta" href="/admin">
            <ShieldCheck aria-hidden="true" size={18} strokeWidth={2.2} />
            <span>Accéder au dashboard</span>
          </Link>

          <button
            type="button"
            className="site-header__menu"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
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
                  href={item.href}
                  className="site-header__drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <Link className="site-header__drawer-cta" href="/admin">
              Accéder au dashboard
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

