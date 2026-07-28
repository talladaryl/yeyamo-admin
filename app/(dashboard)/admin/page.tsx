import {
  AdminActivityFeed,
  AdminLineChart,
  AdminPendingReports,
  AdminPopularPlaces,
  AdminPromoBanner,
  AdminRoleDonut,
  AdminUpcomingEvents
} from "@/components/admin/dashboard";
import { AdminKpiCard } from "@/components/admin/dashboard/admin-kpi-card";
import { AdminSectionCard } from "@/components/admin/dashboard/admin-section-card";
import { mockAdminDashboard } from "@/lib/mocks";
import { Building2, CalendarDays, Star, Ticket, Users } from "lucide-react";

const kpiIconMap = {
  users: Users,
  place: Building2,
  calendar: CalendarDays,
  ticket: Ticket,
  star: Star
} as const;

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <section className="admin-kpi-grid" aria-label="Indicateurs clés">
        {mockAdminDashboard.kpis.map((kpi) => (
          <AdminKpiCard
            key={kpi.label}
            icon={kpiIconMap[kpi.icon as keyof typeof kpiIconMap] ?? Users}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            positive={kpi.positive}
            sparkline={kpi.sparkline}
          />
        ))}
      </section>

      <section className="admin-dashboard__grid">
        <div className="admin-dashboard__chart-stack">
          <AdminLineChart data={mockAdminDashboard.evolution} />
          <div className="admin-dashboard__lower-grid">
            <AdminSectionCard className="admin-dashboard__secondary">
              <div className="admin-section-card__head">
                <h3 className="admin-section-card__title">Détails KPI</h3>
              </div>
              <div className="admin-kpi-summary">
                {mockAdminDashboard.kpis.slice(0, 3).map((kpi) => (
                  <div key={kpi.label} className="admin-kpi-summary__item">
                    <p>{kpi.label}</p>
                    <strong>{kpi.value}</strong>
                  </div>
                ))}
              </div>
            </AdminSectionCard>

            <AdminActivityFeed items={mockAdminDashboard.activities} />
          </div>
        </div>

        <div className="admin-dashboard__side">
          <AdminRoleDonut data={mockAdminDashboard.roles} total="128,450" />
          <AdminPendingReports items={mockAdminDashboard.reports} />
        </div>
      </section>

      <section className="admin-dashboard__bottom">
        <AdminUpcomingEvents items={mockAdminDashboard.events} />
        <AdminPopularPlaces items={mockAdminDashboard.places} />
      </section>

      <AdminPromoBanner />
    </div>
  );
}
