import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const leadSourceSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  code: z.string().min(1),
  source_type: z.string().nullable(),
  config: jsonbSchema,
  is_active: z.boolean(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type LeadSource = z.infer<typeof leadSourceSchema>;
