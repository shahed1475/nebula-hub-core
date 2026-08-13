import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const qualifyLeadInputSchema = z.object({
  companySummary: nonEmptyString,
  companyPainPoints: z.array(z.string()),
  companyIcpFitSignals: z.array(z.string()),
  contactSummary: z.string().nullable().optional(),
  contactPainPoints: z.array(z.string()),
  icpCriteria: z.record(z.string(), z.unknown()),
});
export type QualifyLeadInput = z.infer<typeof qualifyLeadInputSchema>;

export const leadBandSchema = z.enum(["hot", "warm", "cold"]);

export const qualifyLeadOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  band: leadBandSchema,
  reasoning: nonEmptyString,
  disqualifyReason: z.string().nullable().optional(),
});
export type QualifyLeadOutput = z.infer<typeof qualifyLeadOutputSchema>;
