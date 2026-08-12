import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const leadStatus = z.enum([
  "new",
  "researching",
  "qualified",
  "disqualified",
  "approved_for_outreach",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal",
  "won",
  "lost",
]);

export type LeadStatus = z.infer<typeof leadStatus>;

export const leadSchema = z.object({
  id: uuidSchema,
  company_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  source_id: uuidSchema.nullable(),
  status: leadStatus,
  current_score: z.number().nullable(),
  current_strategy_version_id: uuidSchema.nullable(),
  disqualified_reason: z.string().nullable(),
  owner_id: uuidSchema.nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Lead = z.infer<typeof leadSchema>;
