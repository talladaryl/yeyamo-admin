export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">YeYamo</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950">Connexion administrateur</h1>
          <p className="mt-2 text-sm text-slate-500">
            Acces securise au dashboard. Le workflow 2FA sera branche sur le service d&apos;authentification.
          </p>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-rose-300" />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</span>
            <input type="password" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-rose-300" />
          </label>

          <button type="button" className="w-full rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white">
            Se connecter
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Etats a livrer ensuite : captcha optionnel, reset password, 2FA, session expiree et acces refuse.
        </div>
      </div>
    </main>
  );
}
