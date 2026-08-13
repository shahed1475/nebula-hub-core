import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const campaignStatus = z.enum(["draft", "active", "paused", "completed"]);

export const campaignSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  channel: z.string().min(1),
  status: campaignStatus,
  strategy_version_id: uuidSchema.nullable(),
  created_by: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Campaign = z.infer<typeof campaignSchema>;
