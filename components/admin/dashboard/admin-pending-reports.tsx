import Link from "next/link";

import { TriangleAlert } from "lucide-react";

import { AdminIconBox } from "@/components/admin/ui/admin-icon-box";
import type { AdminReportBucket } from "@/lib/types";

export function AdminPendingReports({ items }: { items: AdminReportBucket[] }) {
  return (
    <div className="admin-section-card">
      <div className="admin-section-card__head">
        <h3 className="admin-section-card__title">Signalements en attente</h3>
      </div>

      <div className="admin-bucket-list">
        {items.map((item) => (
          <div key={item.label} className="admin-bucket-list__item">
            <div className="admin-bucket-list__left">
              <AdminIconBox tone="warning">
                <TriangleAlert size={16} />
              </AdminIconBox>
              <div>
                <p className="admin-bucket-list__title">{item.label}</p>
                <p className="admin-bucket-list__subtitle">Vérification requise</p>
              </div>
            </div>
            <span className="admin-bucket-list__count">{item.count}</span>
          </div>
        ))}
      </div>

      <Link href="/admin/moderation" className="admin-section-card__link admin-section-card__link--full">
        Voir tous les signalements
      </Link>
    </div>
  );
}
