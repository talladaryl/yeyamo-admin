import { z } from "zod";
import type { Payment } from "@/features/payments/types";
const schema = z.object({ id: z.string().uuid(), bookingId: z.string().uuid().nullable(), sagaId: z.string().uuid().nullable(), userId: z.string(), amount: z.number().nonnegative(), currency: z.string().length(3), status: z.string(), provider: z.string().nullable(), providerPaymentId: z.string().nullable(), failureReason: z.string().nullable(), createdAt: z.string().datetime({ offset: true }), updatedAt: z.string().datetime({ offset: true }) });
function map(value: z.infer<typeof schema>): Payment { const { userId: _userId, providerPaymentId: _providerPaymentId, ...payment } = value; return payment; }
export function mapPayment(input: unknown): Payment { return map(schema.parse(input)); }
export function mapPayments(input: unknown): Payment[] { return z.array(schema).parse(input).map(map); }
