import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const researchContactInputSchema = z.object({
  fullName: nonEmptyString,
  title: z.string().nullable().optional(),
  companyName: nonEmptyString,
  rawContext: z.string().nullable().optional(),
});
export type ResearchContactInput = z.infer<typeof researchContactInputSchema>;

export const researchContactOutputSchema = z.object({
  summary: nonEmptyString,
  seniority: z.string().nullable().optional(),
  likelyPainPoints: z.array(z.string()),
  personalizationHooks: z.array(z.string()),
  confidence: confidenceSchema,
});
export type ResearchContactOutput = z.infer<typeof researchContactOutputSchema>;
