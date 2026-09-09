"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Button, Field, FormError, Input } from "@/components/public/ui";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { notifyUserAuthChanged, useUserSession } from "@/features/user-auth/user-session-context";
import { userAuthFetch, UserAuthError } from "@/lib/user-auth/client";
import { validateNextPath } from "@/lib/user-auth/next-path";
import type { UserSessionView } from "@/lib/user-auth/types";

export function RegisterForm({ next }: { next?: string }) {
  const router = useRouter(); const { refreshSession } = useUserSession();
  const [token, setToken] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState<string>();
  const onToken = useCallback((value: string) => setToken(value), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(undefined); const form = new FormData(event.currentTarget);
    try {
      await userAuthFetch<UserSessionView>("/api/user/auth/register", { method: "POST", body: JSON.stringify({ email: form.get("email"), phone: null, password: form.get("password"), displayName: form.get("displayName"), turnstileToken: token, countryCode: form.get("countryCode"), cityId: null, preferredLanguageCode: "fr", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }) });
      await refreshSession(); notifyUserAuthChanged("login"); router.replace(validateNextPath(next) as Route);
    } catch (caught) { setError(caught instanceof UserAuthError ? caught.message : "Inscription impossible. Réessayez."); }
    finally { setLoading(false); }
  }
  return <form className="yy-auth-form" onSubmit={submit}><Field label="Nom affiché"><Input name="displayName" maxLength={80} autoComplete="name" /></Field><Field label="Email"><Input name="email" type="email" maxLength={254} autoComplete="email" required /></Field><Field label="Pays (code ISO)"><Input name="countryCode" defaultValue="CM" pattern="[A-Z]{2}" maxLength={2} required /></Field><Field label="Mot de passe"><Input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required /></Field>{error ? <FormError>{error}</FormError> : null}<TurnstileWidget action="register" onToken={onToken} /><Button type="submit" loading={loading} disabled={!token}>Créer mon compte</Button><p className="yy-auth-switch">Déjà inscrit ? <Link href={"/login" as Route}>Se connecter</Link></p></form>;
}
