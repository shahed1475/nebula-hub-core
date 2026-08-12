import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const researchSubjectType = z.enum(["company", "contact"]);
export const researchCreatedBy = z.enum(["agent", "manual"]);

export const researchSchema = z.object({
  id: uuidSchema,
  subject_type: researchSubjectType,
  subject_id: uuidSchema,
  summary: z.string().nullable(),
  findings: jsonbSchema,
  confidence: z.number().min(0).max(1).nullable(),
  source: z.string().nullable(),
  created_by: researchCreatedBy,
  created_at: timestampSchema,
});

export type Research = z.infer<typeof researchSchema>;
