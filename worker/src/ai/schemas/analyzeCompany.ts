import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const analyzeCompanyInputSchema = z.object({
  companyName: nonEmptyString,
  domain: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  rawContext: z.string().nullable().optional(),
});
export type AnalyzeCompanyInput = z.infer<typeof analyzeCompanyInputSchema>;

export const analyzeCompanyOutputSchema = z.object({
  summary: nonEmptyString,
  companySizeEstimate: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  techStack: z.array(z.string()),
  fundingStage: z.string().nullable().optional(),
  painPoints: z.array(z.string()),
  icpFitSignals: z.array(z.string()),
  confidence: confidenceSchema,
});
export type AnalyzeCompanyOutput = z.infer<typeof analyzeCompanyOutputSchema>;
