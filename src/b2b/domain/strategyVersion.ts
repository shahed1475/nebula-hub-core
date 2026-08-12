import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const strategyVersionCreatedBy = z.enum(["system", "agent", "manual"]);

export const strategyVersionSchema = z.object({
  id: uuidSchema,
  strategy_id: uuidSchema,
  version_number: z.number().int().positive(),
  config: jsonbSchema,
  performance_snapshot: jsonbSchema.nullable(),
  notes: z.string().nullable(),
  created_by: strategyVersionCreatedBy,
  created_at: timestampSchema,
});

export type StrategyVersion = z.infer<typeof strategyVersionSchema>;
