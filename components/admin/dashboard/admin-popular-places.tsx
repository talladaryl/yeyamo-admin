import Link from "next/link";
import { Star } from "lucide-react";

import type { AdminPlaceItem } from "@/lib/types";

export function AdminPopularPlaces({ items }: { items: AdminPlaceItem[] }) {
  return (
    <div className="admin-section-card">
      <div className="admin-section-card__head">
        <h3 className="admin-section-card__title">Top lieux populaires</h3>
        <Link href="/admin/places-events" className="admin-section-card__link">
          Voir tout
        </Link>
      </div>

      <div className="admin-place-list">
        {items.map((item, index) => (
          <article key={item.name} className="admin-place-list__item">
            <div className={`admin-place-list__thumb admin-place-list__thumb--${(index % 4) + 1}`}>
              {item.imageLabel}
            </div>
            <div className="admin-place-list__copy">
              <p className="admin-place-list__title">{item.name}</p>
              <p className="admin-place-list__meta">{item.region}</p>
            </div>
            <div className="admin-place-list__rating">
              <Star size={14} fill="currentColor" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
