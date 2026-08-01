"use client";
import { useState } from "react";
import type { z } from "zod";

export type FormErrors = Record<string, string | undefined>;

export function useZodForm<TSchema extends z.ZodType>(schema: TSchema, initialValues: z.input<TSchema>) {
  type Input = z.input<TSchema>;
  const [values, setValues] = useState<Input>(initialValues); const [errors, setErrors] = useState<FormErrors>({}); const [submitting, setSubmitting] = useState(false);
  const setValue = <Key extends keyof Input>(key: Key, value: Input[Key]) => { setValues((current: Input) => ({ ...(current as Record<string, unknown>), [String(key)]: value }) as Input); setErrors((current) => ({ ...current, [String(key)]: undefined })); };
  const validate = () => { const result = schema.safeParse(values); if (result.success) { setErrors({}); return result.data as z.output<TSchema>; } const next: FormErrors = {}; result.error.issues.forEach((issue) => { const key = issue.path[0] === undefined ? "root" : String(issue.path[0]); next[key] ??= issue.message; }); setErrors(next); return undefined; };
  const submit = (handler: (values: z.output<TSchema>) => Promise<void>) => async () => { const valid = validate(); if (!valid) return; setSubmitting(true); setErrors({}); try { await handler(valid); } catch (error) { setErrors({ root: error instanceof Error ? error.message : "La soumission a échoué." }); } finally { setSubmitting(false); } };
  return { values, errors, submitting, setValue, setValues, setErrors, validate, submit };
}
