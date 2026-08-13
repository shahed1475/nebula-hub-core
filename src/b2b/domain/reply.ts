import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const replySchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  in_reply_to_message_id: uuidSchema.nullable(),
  raw_content: z.string().min(1),
  received_at: timestampSchema,
  intent: z.string().nullable(),
  sentiment: z.string().nullable(),
  created_at: timestampSchema,
});

export type Reply = z.infer<typeof replySchema>;
