import { z } from "zod";
import type { EventTicketTypes, Ticket, TicketDetail } from "@/features/ticketing/types";
const date = z.string().datetime({ offset: true }).nullable(); const uuid = z.string().uuid();
const ticket = z.object({ ticketId: uuid, serialNumber: z.string(), eventId: z.string().min(1), status: z.string(), issuedAt: date, usedAt: date });
export function mapEventTicketTypes(input: unknown): EventTicketTypes { return z.object({ eventId: z.string().min(1), currency: z.string().length(3), tickets: z.array(z.object({ id: uuid, code: z.string(), name: z.string(), description: z.string().nullable(), price: z.number().nonnegative(), quantityAvailable: z.number().int().nonnegative(), status: z.string(), salesStartAt: date, salesEndAt: date, accessZone: z.string().nullable(), gateInstructions: z.string().nullable() })) }).parse(input); }
export function mapTickets(input: unknown): Ticket[] { return z.array(ticket).parse(input); }
export function mapTicket(input: unknown): TicketDetail { return ticket.extend({ orderId: uuid, ticketTypeId: uuid, cancelledAt: date, refundedAt: date, createdAt: z.string().datetime({ offset: true }) }).parse(input); }
