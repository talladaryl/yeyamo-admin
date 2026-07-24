import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AdminShell({
  title,
  description,
  children,
  headerVariant = "default"
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerVariant?: "default" | "plain";
}) {
  return (
    <div className="min-h-screen text-slate-950">
      <div className="admin-shell-grid">
        <Sidebar />
        <div className="min-w-0">
          <Topbar />
          <main className="px-5 py-5 xl:px-6">
            <div className="mx-auto max-w-[1560px]">
              {headerVariant === "plain" ? (
                <div className="mb-5">
                  <h1 className="text-[24px] font-semibold tracking-tight text-slate-950">{title}</h1>
                  {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
                </div>
              ) : (
                <div className="mb-5 overflow-hidden rounded-[20px] border border-rose-100 bg-white shadow-[0_8px_24px_rgba(185,28,28,0.05)]">
                  <div className="flex items-start justify-between gap-4 border-b border-rose-100 bg-[linear-gradient(135deg,rgba(185,28,28,0.06),rgba(255,255,255,0)_42%)] px-6 py-5">
                    <div>
                      <p className="admin-subtle-label">Console admin</p>
                      <h1 className="mt-2 text-[28px] font-semibold leading-tight text-slate-950">{title}</h1>
                      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
                    </div>
                    <div className="hidden min-w-[176px] rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-right xl:block">
                      <div className="admin-subtle-label">Etat</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">Operationnel</div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Services critiques stables
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 px-6 py-4 text-sm text-slate-600 xl:grid-cols-3">
                    <div>
                      <div className="admin-subtle-label">Priorite</div>
                      <p className="mt-1 font-medium text-slate-800">Files d&apos;attente, moderation et decisions tracees</p>
                    </div>
                    <div>
                      <div className="admin-subtle-label">Contrainte</div>
                      <p className="mt-1 font-medium text-slate-800">Desktop-first, tables riches, validation motivee</p>
                    </div>
                    <div>
                      <div className="admin-subtle-label">Role actif</div>
                      <p className="mt-1 font-medium text-slate-800">Super Admin</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
