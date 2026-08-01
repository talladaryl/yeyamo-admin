import { z } from "zod";

export const eventSchema = z.object({
  placeId: z.string().uuid("UUID du lieu invalide"),
  title: z.string().trim().min(2).max(255),
  description: z.string().max(10000).optional(),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
  status: z.enum(["DRAFT", "PENDING", "PENDING_REVIEW", "PUBLISHED", "SUSPENDED", "REJECTED", "ARCHIVED", "CANCELLED", "COMPLETED"]).optional()
}).refine((value) => new Date(value.endAt) > new Date(value.startAt), {
  message: "La fin doit suivre le début",
  path: ["endAt"]
});

export type EventFormValues = Omit<z.input<typeof eventSchema>, "capacity"> & { capacity: string | number };
