import { z } from "zod";
import type { Comment, MyProfile, PublicProfile } from "@/features/social/types";
const uuid = z.string().uuid();
const publicProfile = z.object({ id: uuid, displayName: z.string().min(1).max(160), avatarUrl: z.string().url().nullable(), bio: z.string().max(4000).nullable(), language: z.string().nullable(), visibility: z.string(), createdAt: z.string().datetime({ offset: true }) });
const ownProfile = publicProfile.extend({ status: z.string(), notificationsEnabled: z.boolean() });
const comment = z.object({ id: uuid, postId: uuid, parentId: uuid.nullable(), authorId: z.string().min(1).max(100), body: z.string().min(1).max(2000), status: z.string(), createdAt: z.string().datetime({ offset: true }), updatedAt: z.string().datetime({ offset: true }).nullable() });
export function mapPublicProfile(input: unknown): PublicProfile { return publicProfile.parse(input); }
export function mapMyProfile(input: unknown): MyProfile { return ownProfile.parse(input); }
export function mapComments(input: unknown): Comment[] { return z.array(comment).parse(input).filter((item) => item.status === "ACTIVE").map((item) => ({ id: item.id, postId: item.postId, parentId: item.parentId, authorId: item.authorId, body: item.body, createdAt: item.createdAt, updatedAt: item.updatedAt })); }
export function normalizeComment(value: string) { return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, 2000); }
