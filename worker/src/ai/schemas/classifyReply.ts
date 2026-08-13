import { z } from "zod";
import { nonEmptyString } from "./common.js";

export const replyIntentSchema = z.enum([
  "interested",
  "not_interested",
  "question",
  "objection",
  "referral",
  "out_of_office",
  "unsubscribe",
  "other",
]);

export const replySentimentSchema = z.enum(["positive", "neutral", "negative"]);

export const classifyReplyInputSchema = z.object({
  rawContent: nonEmptyString,
  originalMessageSummary: z.string().nullable().optional(),
});
export type ClassifyReplyInput = z.infer<typeof classifyReplyInputSchema>;

export const classifyReplyOutputSchema = z.object({
  intent: replyIntentSchema,
  sentiment: replySentimentSchema,
  summary: nonEmptyString,
  suggestedNextAction: z.string().nullable().optional(),
});
export type ClassifyReplyOutput = z.infer<typeof classifyReplyOutputSchema>;
