export type Conversation = { id: string; type: string; title: string | null; updatedAt: string; lastMessagePreview: string | null; lastMessageAt: string | null };
export type Message = { id: string; conversationId: string; senderId: string; clientMessageId: string; type: string; body: string | null; attachmentIds: string[]; sentAt: string; editedAt: string | null; deletedAt: string | null };
export type MessageSlice = { items: Message[]; nextBefore: string | null; hasNext: boolean };
