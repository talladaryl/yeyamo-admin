export type Page<T> = { items: T[]; page: number; size: number; totalElements: number; totalPages: number; last: boolean };
export type CollectionSummary = { id: string; title: string; description: string | null; isPublic: boolean; placeCount: number; updatedAt: string };
export type Notification = { id: string; eventType: string; title: string; body: string; data: Record<string, unknown>; createdAt: string; readAt: string | null };
export type UnreadCount = { count: number };
