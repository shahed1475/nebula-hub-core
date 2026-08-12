import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const companySchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  domain: z.string().nullable(),
  industry: z.string().nullable(),
  size_range: z.string().nullable(),
  country: z.string().nullable(),
  website: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  description: z.string().nullable(),
  metadata: jsonbSchema,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Company = z.infer<typeof companySchema>;
