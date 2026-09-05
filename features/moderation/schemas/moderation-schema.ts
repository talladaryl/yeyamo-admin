import{z}from"zod";export const decisionSchema=z.object({status:z.enum(["APPROVED","REJECTED"]),resolution:z.string().trim().min(5).max(2000)});
