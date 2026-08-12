import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const strategySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  description: z.string().nullable(),
  is_active: z.boolean(),
  current_version_id: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Strategy = z.infer<typeof strategySchema>;
