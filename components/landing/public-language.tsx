"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { english } from "@/lib/public/translations";
import { localizedHref } from "@/lib/public/locale";
import { isPublicPage } from "@/lib/public/pages";
import type { PublicLocale } from "@/lib/public/resource-content";

const LanguageContext = createContext<PublicLocale>("fr");
const LandingNavigationContext = createContext(false);

export function LandingNavigationProvider({ children }: { children: ReactNode }) {
  return <LandingNavigationContext.Provider value>{children}</LandingNavigationContext.Provider>;
}

export function PublicLanguageProvider({ locale, children }: { locale: PublicLocale; children: ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function usePublicLanguage() {
  const locale = useContext(LanguageContext);
  const landingNavigation = useContext(LandingNavigationContext);
  function t<T extends ReactNode>(text: T): T | string {
    if (typeof text !== "string" || locale === "fr") return text;
    const normalized = text.replace(/\s+/g, " ").trim();
    const translated = english[normalized];
    if (translated === undefined) return text;
    const leading = text.match(/^\s*/)?.[0] ?? "";
    const trailing = text.match(/\s*$/)?.[0] ?? "";
    return `${leading}${translated}${trailing}`;
  }
  return { locale, t, href: (path: string) => {
    if (landingNavigation && path === "/") return "#top";
    const [pathname, anchor] = path.split("#");
    if (pathname.startsWith("/") && isPublicPage(pathname.slice(1))) {
      const section = anchor ? `#${anchor}` : `#section-${pathname.slice(1)}`;
      return landingNavigation ? section : localizedHref(`/${section}`, locale);
    }
    return localizedHref(path, locale);
  } };
}

export function LanguageSwitcher() {
  const { locale } = usePublicLanguage();
  const pathname = usePathname();
  return (
    <nav className="public-language" aria-label={locale === "fr" ? "Langue du site" : "Website language"}>
      {(["fr", "en"] as const).map((language) => (
        <a key={language} href={localizedHref(pathname, language)} hrefLang={language} lang={language}
          aria-label={language === "fr" ? "Français" : "English"}
          aria-current={locale === language ? "true" : undefined}
          onClick={(event) => {
            // Keep the current section when changing language.
            event.currentTarget.href = `${localizedHref(pathname, language)}${window.location.hash}`;
          }}>
          {language.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
