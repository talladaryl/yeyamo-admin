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

export function LoginForm({ next, onAuthenticated, compact = false }: { next?: string; onAuthenticated?: () => void; compact?: boolean }) {
  const router = useRouter();
  const { refreshSession } = useUserSession();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const onToken = useCallback((value: string) => setToken(value), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      await userAuthFetch<UserSessionView>("/api/user/auth/login", { method: "POST", body: JSON.stringify({ identifier: form.get("identifier"), password: form.get("password"), turnstileToken: token }) });
      await refreshSession(); notifyUserAuthChanged("login");
      if (onAuthenticated) onAuthenticated(); else router.replace(validateNextPath(next) as Route);
    } catch (caught) {
      setError(caught instanceof UserAuthError ? caught.message : "Connexion impossible. Réessayez.");
    } finally { setLoading(false); }
  }
  return <form className="yy-auth-form" onSubmit={submit}><Field label="Email ou téléphone"><Input name="identifier" autoComplete="username" maxLength={254} required /></Field><Field label="Mot de passe"><Input name="password" type="password" autoComplete="current-password" minLength={8} maxLength={128} required /></Field>{error ? <FormError>{error}</FormError> : null}<TurnstileWidget action="login" onToken={onToken} /><Button type="submit" loading={loading} disabled={!token}>Se connecter</Button>{!compact ? <div className="yy-auth-links"><Link href={"/forgot-password" as Route}>Mot de passe oublié ?</Link><Link href={`/register${next ? `?next=${encodeURIComponent(validateNextPath(next))}` : ""}` as Route}>Créer un compte</Link></div> : null}</form>;
}
