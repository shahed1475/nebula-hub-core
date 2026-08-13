import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const generateOutreachInputSchema = z.object({
  companyName: nonEmptyString,
  contactName: nonEmptyString,
  contactTitle: z.string().nullable().optional(),
  companyPainPoints: z.array(z.string()),
  personalizationHooks: z.array(z.string()),
  channel: nonEmptyString,
  messagingThemes: z.array(z.string()).nullable().optional(),
});
export type GenerateOutreachInput = z.infer<typeof generateOutreachInputSchema>;

export const generateOutreachOutputSchema = z.object({
  subject: z.string().nullable().optional(),
  body: nonEmptyString,
  channel: nonEmptyString,
});
export type GenerateOutreachOutput = z.infer<typeof generateOutreachOutputSchema>;
