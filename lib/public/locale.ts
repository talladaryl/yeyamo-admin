import type { PublicLocale } from "./resource-content";

export function getPublicLocale(value: string | string[] | undefined): PublicLocale {
  return value === "en" ? "en" : "fr";
}

export function localizedHref(href: string, locale: PublicLocale): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/admin")) return href;
  const url = new URL(href, "https://yeyamo.local");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
