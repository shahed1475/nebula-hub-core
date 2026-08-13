import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const outreachMessageEventType = z.enum([
  "queued",
  "sent",
  "delivered",
  "opened",
  "clicked",
  "bounced",
  "failed",
  "unsubscribed",
]);

export const outreachMessageEventSchema = z.object({
  id: uuidSchema,
  message_id: uuidSchema,
  event_type: outreachMessageEventType,
  metadata: jsonbSchema,
  occurred_at: timestampSchema,
});

export type OutreachMessageEvent = z.infer<typeof outreachMessageEventSchema>;
