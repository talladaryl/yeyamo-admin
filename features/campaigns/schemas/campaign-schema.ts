import{z}from"zod";export const rejectCampaignSchema=z.object({rejectionReason:z.string().trim().min(10).max(1000)});
