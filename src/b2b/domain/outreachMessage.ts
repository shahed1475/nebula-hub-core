import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const outreachMessageStatus = z.enum(["draft", "approved", "queued", "sent", "failed"]);

export const outreachMessageSchema = z.object({
  id: uuidSchema,
  campaign_lead_id: uuidSchema,
  channel: z.string().min(1),
  direction: z.literal("outbound"),
  subject: z.string().nullable(),
  body: z.string().nullable(),
  status: outreachMessageStatus,
  scheduled_at: timestampSchema.nullable(),
  sent_at: timestampSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type OutreachMessage = z.infer<typeof outreachMessageSchema>;
