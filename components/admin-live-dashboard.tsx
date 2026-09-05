"use client";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin-api";
import { queryKeys } from "@/lib/query/query-keys";
import { AdminErrorState, AdminSkeleton, AdminStatCard } from "@/components/admin/ui/admin-foundation";
const format = (value: unknown) => typeof value === "number" ? new Intl.NumberFormat("fr-FR").format(value) : typeof value === "string" ? value : JSON.stringify(value);
export function AdminLiveDashboard() { const query = useQuery({ queryKey: queryKeys.analytics.detail("dashboard"), queryFn: adminApi.analytics.dashboard }); if (query.isLoading) return <AdminSkeleton rows={6} />; if (query.error) return <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />; return <div className="admin-dashboard"><section className="admin-kpi-grid" aria-label="Indicateurs clés">{Object.entries(query.data ?? {}).map(([key, value]) => <AdminStatCard key={key} label={key} value={format(value)} />)}</section><section className="admin-section-card"><h2 className="admin-section-card__title">Source temps réel</h2><p>Données fournies par <code>/api/v1/analytics/admin/dashboard</code>.</p></section></div>; }
