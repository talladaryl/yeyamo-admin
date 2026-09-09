export type TicketType = { id: string; code: string; name: string; description: string | null; price: number; quantityAvailable: number; status: string; salesStartAt: string | null; salesEndAt: string | null; accessZone: string | null; gateInstructions: string | null };
export type EventTicketTypes = { eventId: string; currency: string; tickets: TicketType[] };
export type Ticket = { ticketId: string; serialNumber: string; eventId: string; status: string; issuedAt: string | null; usedAt: string | null };
export type TicketDetail = Ticket & { orderId: string; ticketTypeId: string; cancelledAt: string | null; refundedAt: string | null; createdAt: string };
