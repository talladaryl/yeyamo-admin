import Link from "next/link";

import { CalendarDays } from "lucide-react";

import { AdminIconBox } from "@/components/admin/ui/admin-icon-box";
import type { AdminEventItem } from "@/lib/types";

export function AdminUpcomingEvents({ items }: { items: AdminEventItem[] }) {
  return (
    <div className="admin-section-card">
      <div className="admin-section-card__head">
        <h3 className="admin-section-card__title">Événements à venir</h3>
        <Link href="/admin/events" className="admin-section-card__link">
          Voir tout
        </Link>
      </div>

      <div className="admin-event-list">
        {items.map((item, index) => (
          <article key={item.title} className="admin-event-list__item">
            <div className={`admin-event-list__thumb admin-event-list__thumb--${(index % 4) + 1}`}>
              {item.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="admin-event-list__copy">
              <p className="admin-event-list__title">{item.title}</p>
              <p className="admin-event-list__meta">{item.place}</p>
              <p className="admin-event-list__date">{item.date}</p>
            </div>
            <div className="admin-event-list__status">
              <span className="admin-event-list__badge">{item.badge}</span>
              <span className="admin-event-list__icon">
                <AdminIconBox tone="info">
                  <CalendarDays size={14} />
                </AdminIconBox>
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
