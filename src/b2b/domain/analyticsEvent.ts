import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const analyticsEventSchema = z.object({
  id: uuidSchema,
  event_type: z.string().min(1),
  subject_type: z.string().nullable(),
  subject_id: uuidSchema.nullable(),
  strategy_version_id: uuidSchema.nullable(),
  metadata: jsonbSchema,
  occurred_at: timestampSchema,
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
