"use client";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const search = useSearchParams(); const [loading, setLoading] = useState(false); const [error, setError] = useState<string>();
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(undefined); const form = new FormData(event.currentTarget); const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: form.get("identifier"), password: form.get("password") }) }).catch(() => undefined); if (!response?.ok) { const payload = await response?.json().catch(() => ({})); setError(payload?.message ?? "Connexion au backend impossible."); setLoading(false); return; } const target = search.get("next"); window.location.assign(target?.startsWith("/admin") ? target : "/admin"); }
  return <form className="admin-login__form" onSubmit={submit}><label><span>Email ou téléphone</span><input name="identifier" type="text" autoComplete="username" required /></label><label><span>Mot de passe</span><input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>{error ? <p className="admin-login__error" role="alert">{error}</p> : null}<button type="submit" className="admin-login__submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</button></form>;
}
