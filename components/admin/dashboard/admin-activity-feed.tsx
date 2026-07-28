import { AdminIconBox } from "@/components/admin/ui/admin-icon-box";
import type { AdminActivityItem } from "@/lib/types";
import { Flag, MapPin, Star, Ticket, Users } from "lucide-react";

const iconMap = {
  "map-pin": MapPin,
  ticket: Ticket,
  star: Star,
  flag: Flag,
  partner: Users
} as const;

const toneMap: Record<AdminActivityItem["tone"], "primary" | "success" | "warning" | "info"> = {
  success: "success",
  warning: "warning",
  danger: "primary",
  info: "info"
};

export function AdminActivityFeed({ items }: { items: AdminActivityItem[] }) {
  return (
    <div className="admin-section-card">
      <div className="admin-section-card__head">
        <h3 className="admin-section-card__title">Activité en temps réel</h3>
      </div>

      <div className="admin-feed">
        {items.map((item) => (
          <article key={`${item.title}-${item.description}`} className="admin-feed__item">
            <AdminIconBox tone={toneMap[item.tone]}>
              {(() => {
                const Icon = iconMap[item.icon];
                return <Icon size={16} aria-hidden="true" />;
              })()}
            </AdminIconBox>
            <div className="admin-feed__copy">
              <p className="admin-feed__title">{item.title}</p>
              <p className="admin-feed__text">{item.description}</p>
            </div>
            <span className="admin-feed__time">{item.time}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
