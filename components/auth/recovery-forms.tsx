"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Button, Field, FormError, Input } from "@/components/public/ui";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { userAuthFetch, UserAuthError } from "@/lib/user-auth/client";

function useSubmission() {
  const [loading, setLoading] = useState(false); const [error, setError] = useState<string>(); const [success, setSuccess] = useState<string>();
  const submit = async (path: string, body: unknown, message: string) => { setLoading(true); setError(undefined); setSuccess(undefined); try { await userAuthFetch(path, { method: "POST", body: JSON.stringify(body) }); setSuccess(message); } catch (caught) { setError(caught instanceof UserAuthError ? caught.message : "Opération impossible."); } finally { setLoading(false); } };
  return { loading, error, success, submit };
}

export function ForgotPasswordForm() {
  const state = useSubmission(); const [token, setToken] = useState(""); const onToken = useCallback((value: string) => setToken(value), []);
  return <form className="yy-auth-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); void state.submit("/api/user/auth/password/forgot", { email: form.get("email"), turnstileToken: token }, "Si ce compte existe, un code a été envoyé."); }}><Field label="Email"><Input name="email" type="email" autoComplete="email" required /></Field>{state.error ? <FormError>{state.error}</FormError> : null}{state.success ? <p role="status">{state.success}</p> : null}<TurnstileWidget action="forgot_password" onToken={onToken} /><Button type="submit" loading={state.loading} disabled={!token}>Envoyer le code</Button></form>;
}

export function ResetPasswordForm() {
  const state = useSubmission();
  return <form className="yy-auth-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); void state.submit("/api/user/auth/password/reset", { email: form.get("email"), otp: form.get("otp"), newPassword: form.get("newPassword") }, "Mot de passe réinitialisé. Vous pouvez vous connecter."); }}><Field label="Email"><Input name="email" type="email" required /></Field><Field label="Code à 6 chiffres"><Input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></Field><Field label="Nouveau mot de passe"><Input name="newPassword" type="password" minLength={12} maxLength={128} required /></Field>{state.error ? <FormError>{state.error}</FormError> : null}{state.success ? <p role="status">{state.success}</p> : null}<Button type="submit" loading={state.loading}>Réinitialiser</Button></form>;
}

export function VerifyEmailForm() {
  const state = useSubmission(); const [token, setToken] = useState(""); const onToken = useCallback((value: string) => setToken(value), []);
  return <form className="yy-auth-form" onSubmit={(event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); void state.submit("/api/user/auth/email/verification/confirm", { email: form.get("email"), otp: form.get("otp") }, "Email vérifié."); }}><Field label="Email"><Input name="email" type="email" required /></Field><Field label="Code à 6 chiffres"><Input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required /></Field>{state.error ? <FormError>{state.error}</FormError> : null}{state.success ? <p role="status">{state.success}</p> : null}<Button type="submit" loading={state.loading}>Vérifier</Button><TurnstileWidget action="resend_otp" onToken={onToken} /><Button type="button" disabled={!token} onClick={(event) => { const form = event.currentTarget.form; void state.submit("/api/user/auth/email/verification/request", { email: new FormData(form ?? undefined).get("email"), turnstileToken: token }, "Si ce compte existe, un nouveau code a été envoyé."); }}>Renvoyer le code</Button></form>;
}
