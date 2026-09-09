import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().trim().min(1).max(254),
  password: z.string().min(8).max(128),
  turnstileToken: z.string().min(1).max(4096)
});

export const registerSchema = z.object({
  email: z.string().email().max(254).nullable().optional(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/).nullable().optional(),
  password: z.string().min(12).max(128),
  displayName: z.string().max(80).regex(/^[\p{L}\p{N} .'-]*$/u).nullable().optional(),
  turnstileToken: z.string().min(1).max(4096),
  countryCode: z.string().regex(/^[A-Z]{2}$/).nullable().optional(),
  cityId: z.string().uuid().nullable().optional(),
  preferredLanguageCode: z.string().max(10).nullable().optional(),
  timezone: z.string().max(50).nullable().optional()
}).refine((value) => Boolean(value.email || value.phone), { message: "Un email ou un téléphone est requis." });

export const emailRequestSchema = z.object({
  email: z.string().email().max(254),
  turnstileToken: z.string().max(4096).optional()
});

export const otpSchema = z.object({ email: z.string().email().max(254), otp: z.string().regex(/^\d{6}$/) });
export const resetPasswordSchema = otpSchema.extend({ newPassword: z.string().min(12).max(128) });
