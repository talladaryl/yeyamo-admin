"use client";

import { useEffect, useRef } from "react";
import { ChevronDown, ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import type { PublicLocale, ResourceSection } from "@/lib/public/resource-content";

export function DocumentationSections({ sections, locale, kind = "documentation" }: { sections: ResourceSection[]; locale: PublicLocale; kind?: "privacy" | "documentation" }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reveal = (hash: string) => {
      const section = sections.find((item) => `#${item.id}` === hash);
      if (!section) return;
      const detail = container.current?.querySelector<HTMLDetailsElement>(`[id="${section.id}"]`);
      if (detail) { detail.open = true; detail.scrollIntoView({ block: "start" }); }
    };
    const revealHash = () => reveal(window.location.hash);
    const revealLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (anchor) reveal(anchor.hash);
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    document.addEventListener("click", revealLink);
    return () => {
      window.removeEventListener("hashchange", revealHash);
      document.removeEventListener("click", revealLink);
    };
  }, [sections]);

  function toggleAll(open: boolean) {
    container.current?.querySelectorAll("details").forEach((detail) => { detail.open = open; });
  }

  return (
    <div ref={container} className="documentation-sections">
      <div className="documentation-toolbar">
        <p>{kind === "privacy" ? (locale === "fr" ? "Dépliez une rubrique pour consulter la politique de confidentialité." : "Expand a section to read the privacy policy.") : (locale === "fr" ? "Choisissez une rubrique pour lire le guide." : "Choose a section to read the guide.")}</p>
        <div>
          <button type="button" onClick={() => toggleAll(true)}><ListChevronsUpDown size={16} aria-hidden="true" />{locale === "fr" ? "Tout déplier" : "Expand all"}</button>
          <button type="button" onClick={() => toggleAll(false)}><ListChevronsDownUp size={16} aria-hidden="true" />{locale === "fr" ? "Tout replier" : "Collapse all"}</button>
        </div>
      </div>
      {sections.map((section, index) => (
        <details key={section.id} className="documentation-section" id={section.id} open={index === 0}>
          <summary><span className="documentation-section__number">{String(index + 1).padStart(2, "0")}</span><h2>{section.title.replace(/^\d+\.\s*/, "")}</h2><ChevronDown size={20} aria-hidden="true" /></summary>
          <div className="documentation-section__body">
            {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            {section.steps && <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
          </div>
        </details>
      ))}
    </div>
  );
}
