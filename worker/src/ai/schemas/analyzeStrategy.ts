import { z } from "zod";
import { confidenceSchema, nonEmptyString } from "./common.js";

export const analyzeStrategyInputSchema = z.object({
  currentConfig: z.record(z.string(), z.unknown()),
  performanceMetrics: z.object({
    totalLeads: z.number().int().min(0),
    qualifiedLeads: z.number().int().min(0),
    repliesReceived: z.number().int().min(0),
    meetingsBooked: z.number().int().min(0),
    wonDeals: z.number().int().min(0),
    lostDeals: z.number().int().min(0),
    replyRate: z.number().min(0),
    meetingRate: z.number().min(0),
    winRate: z.number().min(0),
  }),
});
export type AnalyzeStrategyInput = z.infer<typeof analyzeStrategyInputSchema>;

export const strategyRecommendationSchema = z.object({
  field: nonEmptyString,
  currentValue: z.string().nullable().optional(),
  suggestedValue: nonEmptyString,
  reasoning: nonEmptyString,
});

export const analyzeStrategyOutputSchema = z.object({
  summary: nonEmptyString,
  recommendedChanges: z.array(strategyRecommendationSchema),
  confidence: confidenceSchema,
});
export type AnalyzeStrategyOutput = z.infer<typeof analyzeStrategyOutputSchema>;
