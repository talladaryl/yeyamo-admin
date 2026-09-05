import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { adminNavigation, type AdminModule } from "@/lib/admin-config";

export function ModulePage({ module }: { module: AdminModule }) {
  const related = adminNavigation.filter(
    (entry) => entry.domain === module.domain && entry.href !== module.href && entry.showInSidebar !== false
  );

  return (
    <div className="admin-module">
      <section className="admin-section-card admin-module__hero">
        <div className="admin-module__copy">
          <span className="admin-module__eyebrow">{module.domain}</span>
          <h2 className="admin-module__title">{module.label}</h2>
          <p className="admin-module__text">{module.summary}</p>
        </div>

        <div className="admin-module__aside">
          <div className="admin-module__action">
            <Sparkles size={18} aria-hidden="true" />
            <span>{module.primaryAction}</span>
          </div>
          <div className="admin-module__chips">
            {module.highlights.map((item) => (
              <span key={item} className="admin-module__chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="admin-module__grid">
        <section className="admin-section-card">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Vue d&apos;ensemble</h3>
            <Link href={module.href as Route} className="admin-section-card__link">
              Actualiser
            </Link>
          </div>
          <p className="admin-section-card__text">
            Cette page reprend la logique visuelle de l&apos;administration YeYamo avec des
            composants composés, des métriques et des actions liées à la route courante.
          </p>
        </section>

        <section className="admin-section-card">
          <div className="admin-section-card__head">
            <h3 className="admin-section-card__title">Accès connexes</h3>
            <Link href="/admin" className="admin-section-card__link">
              Retour dashboard
            </Link>
          </div>
          <div className="admin-module__related">
            {related.slice(0, 4).map((entry) => (
              <Link key={entry.href} href={entry.href as Route} className="admin-module__related-link">
                <span>{entry.label}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
