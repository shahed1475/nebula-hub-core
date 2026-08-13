import { z } from "zod";
import { nonEmptyString } from "./common.js";
import { replyIntentSchema, replySentimentSchema } from "./classifyReply.js";

export const generateReplyInputSchema = z.object({
  rawContent: nonEmptyString,
  intent: replyIntentSchema,
  sentiment: replySentimentSchema,
  companyName: nonEmptyString,
  contactName: nonEmptyString,
  conversationSummary: z.string().nullable().optional(),
});
export type GenerateReplyInput = z.infer<typeof generateReplyInputSchema>;

export const generateReplyOutputSchema = z.object({
  body: nonEmptyString,
});
export type GenerateReplyOutput = z.infer<typeof generateReplyOutputSchema>;
