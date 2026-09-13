import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HomeContent from "@/components/landing/home-content";
import { PublicLanguageProvider } from "@/components/landing/public-language";
import { ResourcePage } from "@/components/landing/resource-page";
import { getPublicLocale, localizedHref } from "@/lib/public/locale";
import { DocumentationSections } from "@/components/landing/documentation-sections";
import { documentationContent, privacyContent } from "@/lib/public/resource-content";
import { PublicSectionPage } from "@/components/landing/public-section-page";
import { publicPages, type PublicPageSlug } from "@/lib/public/pages";

vi.mock("next/navigation", () => ({ usePathname: () => "/documentation" }));

function parse(html: string) { return new DOMParser().parseFromString(html, "text/html"); }

describe("public navigation and languages", () => {
  it.each(["documentation", "privacy"] as const)("expands and collapses %s and reopens a section from the same anchor", (kind) => {
    const scroll = vi.fn();
    const originalScroll = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = scroll;
    try {
      const sections = (kind === "privacy" ? privacyContent : documentationContent).en.sections;
      const target = sections[4].id;
      const { container } = render(<><a href={`#${target}`}>Go to section</a><DocumentationSections sections={sections} locale="en" kind={kind} /></>);
      fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
      expect(container.querySelectorAll("details[open]")).toHaveLength(sections.length);
      fireEvent.click(screen.getByRole("button", { name: "Collapse all" }));
      expect(container.querySelectorAll("details[open]")).toHaveLength(0);
      fireEvent.click(screen.getByRole("link", { name: "Go to section" }));
      expect(container.querySelector(`#${target}`)).toHaveAttribute("open");
      fireEvent.click(screen.getByRole("button", { name: "Collapse all" }));
      fireEvent.click(screen.getByRole("link", { name: "Go to section" }));
      expect(container.querySelector(`#${target}`)).toHaveAttribute("open");
      expect(scroll).toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.scrollIntoView = originalScroll;
    }
  });
  it("keeps language and anchors in public links without altering external or admin URLs", () => {
    expect(localizedHref("/documentation#support", "en")).toBe("/documentation?lang=en#support");
    expect(localizedHref("/confidentialite?lang=fr", "en")).toBe("/confidentialite?lang=en");
    expect(localizedHref("mailto:hello@yeyamo.cm", "en")).toBe("mailto:hello@yeyamo.cm");
    expect(localizedHref("/admin", "en")).toBe("/admin");
    expect(getPublicLocale(["en", "fr"])).toBe("fr");
    expect(getPublicLocale("de")).toBe("fr");
  });

  it.each(["fr", "en"] as const)("renders the %s homepage with real resources and no admin entry", (locale) => {
    const page = parse(renderToStaticMarkup(<PublicLanguageProvider locale={locale}><HomeContent /></PublicLanguageProvider>));
    const heading = page.querySelector("h1")?.textContent;
    expect(heading).toContain(locale === "en" ? "Explore Africa" : "Explorer l’Afrique");
    expect(page.querySelector(`footer a[href="/confidentialite?lang=${locale}"]`)).not.toBeNull();
    expect(page.querySelector(`a[href="/documentation?lang=${locale}"]`)).not.toBeNull();
    expect(page.querySelector('a[href^="/admin"]')).toBeNull();
    if (locale === "en") {
      expect(page.body.textContent).toContain("Explore destinations");
      expect(page.querySelector("#features")).toBeNull();
      expect(page.querySelector('a[href="/destinations?lang=en"]')).not.toBeNull();
      expect(page.body.textContent).not.toMatch(/Télécharger|Confidentialité|Politique de confidentialité|membres|Données protégées/);
    }
  });

  it.each(["fr", "en"] as const)("renders each %s section on its own page with valid navigation", (locale) => {
    for (const slug of Object.keys(publicPages) as PublicPageSlug[]) {
      const page = parse(renderToStaticMarkup(<PublicLanguageProvider locale={locale}><PublicSectionPage page={slug} /></PublicLanguageProvider>));
      expect(page.querySelector("h1")?.textContent).toBe(publicPages[slug][locale]);
      expect(page.querySelector(".public-section-related")).toBeNull();
      expect(page.body.textContent).not.toMatch(/Retour à l’accueil|Back to home/);
      expect(page.querySelector(".public-hero-background img")?.getAttribute("src")).toBe(`/backgrounds/${slug}.svg`);
      expect(page.querySelector('a[href^="/admin"]')).toBeNull();
      expect(page.querySelector('a[href^="https://example.com"]')).toBeNull();
      for (const link of page.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
        if (link.hasAttribute("hreflang")) continue;
        const url = new URL(link.getAttribute("href")!, "https://yeyamo.local");
        expect(url.searchParams.get("lang")).toBe(locale);
        expect(url.pathname === "/" || url.pathname === "/documentation" || url.pathname === "/confidentialite" || Object.hasOwn(publicPages, url.pathname.slice(1))).toBe(true);
      }
    }
  });

  it.each(["fr", "en"] as const)("renders complete %s documents with working section anchors", (locale) => {
    for (const kind of ["privacy", "documentation"] as const) {
      const page = parse(renderToStaticMarkup(<ResourcePage kind={kind} locale={locale} />));
      expect(page.querySelectorAll("h1")).toHaveLength(1);
      expect(page.querySelectorAll("article details")).toHaveLength((kind === "privacy" ? privacyContent : documentationContent)[locale].sections.length);
      expect(page.querySelectorAll("article section, article details").length).toBeGreaterThanOrEqual(10);
      for (const anchor of page.querySelectorAll('.resource-toc nav a[href^="#"]')) {
        expect(page.getElementById(anchor.getAttribute("href")!.slice(1))).not.toBeNull();
      }
      expect(page.querySelector(`a[href="/?lang=${locale}"]`)).not.toBeNull();
      expect(page.querySelector('[aria-label="English"]')?.getAttribute("href")).toBe("/documentation?lang=en");
      expect(page.querySelector("article")!.textContent!.split(/\s+/).length).toBeGreaterThan(600);
    }
  });
});
