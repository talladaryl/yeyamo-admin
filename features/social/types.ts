export type PublicProfile = { id: string; displayName: string; avatarUrl: string | null; bio: string | null; language: string | null; visibility: string; createdAt: string };
export type MyProfile = PublicProfile & { status: string; notificationsEnabled: boolean };
export type Comment = { id: string; postId: string; parentId: string | null; authorId: string; body: string; createdAt: string; updatedAt: string | null };
export type PublicError = { code: string; message: string; retryable: boolean; correlationId?: string };
export type SocialStats = { followersCount: number; followingCount: number };
