import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const contactSchema = z.object({
  id: uuidSchema,
  company_id: uuidSchema,
  full_name: z.string().min(1),
  title: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  is_primary: z.boolean(),
  source_id: uuidSchema.nullable(),
  opted_out: z.boolean(),
  opted_out_at: timestampSchema.nullable(),
  metadata: jsonbSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Contact = z.infer<typeof contactSchema>;
