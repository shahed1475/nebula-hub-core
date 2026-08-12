import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const leadScoreScoredBy = z.enum(["agent", "manual"]);

export const leadScoreSchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  score: z.number(),
  band: z.string().nullable(),
  reasoning: z.string().nullable(),
  strategy_version_id: uuidSchema.nullable(),
  scored_by: leadScoreScoredBy,
  created_at: timestampSchema,
});

export type LeadScore = z.infer<typeof leadScoreSchema>;
