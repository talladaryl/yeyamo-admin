"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { english } from "@/lib/public/translations";
import { localizedHref } from "@/lib/public/locale";
import type { PublicLocale } from "@/lib/public/resource-content";

const LanguageContext = createContext<PublicLocale>("fr");

export function PublicLanguageProvider({ locale, children }: { locale: PublicLocale; children: ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function usePublicLanguage() {
  const locale = useContext(LanguageContext);
  function t<T extends ReactNode>(text: T): T | string {
    if (typeof text !== "string" || locale === "fr") return text;
    const normalized = text.replace(/\s+/g, " ").trim();
    const translated = english[normalized];
    if (translated === undefined) return text;
    const leading = text.match(/^\s*/)?.[0] ?? "";
    const trailing = text.match(/\s*$/)?.[0] ?? "";
    return `${leading}${translated}${trailing}`;
  }
  return { locale, t, href: (path: string) => localizedHref(path, locale) };
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
