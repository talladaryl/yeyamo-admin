import { ArrowUpRight, BookOpen, ShieldCheck } from "lucide-react";
import { PublicLanguageProvider } from "./public-language";
import { LandingHeader } from "./landing-header";
import { LandingFooter } from "./footer";
import { DocumentationSections } from "./documentation-sections";
import { localizedHref } from "@/lib/public/locale";
import { documentationContent, privacyContent, type PublicLocale } from "@/lib/public/resource-content";
import "./resources.css";

export function ResourcePage({ kind, locale }: { kind: "privacy" | "documentation"; locale: PublicLocale }) {
  const isFrench = locale === "fr";
  const content = (kind === "privacy" ? privacyContent : documentationContent)[locale];
  const href = (path: string) => localizedHref(path, locale);
  const Icon = kind === "privacy" ? ShieldCheck : BookOpen;
  return (
    <PublicLanguageProvider locale={locale}>
      <div className={`resource-page resource-page--${kind}`} lang={locale} id="top">
        <a className="public-skip-link" href="#resource-content">{isFrench ? "Aller au contenu" : "Skip to content"}</a>
        <LandingHeader />
        <main id="resource-content">
          <section className="resource-hero">
            <div className="resource-eyebrow"><Icon size={18} aria-hidden="true" />{isFrench ? "LES RESSOURCES YEYAMO" : "YEYAMO RESOURCES"}</div>
            <h1>{content.title}</h1><p>{content.intro}</p>
            <div className="resource-meta"><span>{isFrench ? "Mis à jour le 13 septembre 2026" : "Updated September 13, 2026"}</span><span>{content.sections.length} {isFrench ? "rubriques" : "sections"}</span></div>
          </section>
          <div className="resource-layout">
            <aside className="resource-toc">
              <nav aria-label={isFrench ? "Sommaire" : "On this page"}>
                <h2>{isFrench ? "Dans cette page" : "On this page"}</h2>
                {content.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
              </nav>
              <a className="resource-contact" href="mailto:hello@yeyamo.cm"><span>{isFrench ? "Une question ?" : "Have a question?"}</span><strong>{isFrench ? "Contacter l’équipe" : "Contact the team"}<ArrowUpRight size={16} aria-hidden="true" /></strong></a>
            </aside>
            <article className="resource-article">
              <DocumentationSections sections={content.sections} locale={locale} kind={kind} />
              <div className="resource-next"><span>{isFrench ? "Pour continuer" : "Keep exploring"}</span>
                <a href={href(kind === "privacy" ? "/documentation" : "/confidentialite")}>{kind === "privacy" ? (isFrench ? "Consulter la documentation" : "Read the documentation") : (isFrench ? "Lire la politique de confidentialité" : "Read the privacy policy")}<ArrowUpRight size={20} aria-hidden="true" /></a>
              </div>
            </article>
          </div>
        </main>
        <LandingFooter />
      </div>
    </PublicLanguageProvider>
  );
}
