import { describe, expect, it } from "vitest";
import { analyzeStrategyInputSchema, analyzeStrategyOutputSchema } from "./analyzeStrategy.js";

const validMetrics = {
  totalLeads: 100,
  qualifiedLeads: 40,
  repliesReceived: 10,
  meetingsBooked: 3,
  wonDeals: 1,
  lostDeals: 2,
  replyRate: 0.1,
  meetingRate: 0.03,
  winRate: 0.01,
};

describe("analyzeStrategyInputSchema", () => {
  it("accepts a valid input", () => {
    expect(() =>
      analyzeStrategyInputSchema.parse({ currentConfig: {}, performanceMetrics: validMetrics })
    ).not.toThrow();
  });

  it("rejects a negative metric", () => {
    expect(() =>
      analyzeStrategyInputSchema.parse({
        currentConfig: {},
        performanceMetrics: { ...validMetrics, totalLeads: -1 },
      })
    ).toThrow();
  });
});

describe("analyzeStrategyOutputSchema", () => {
  const valid = {
    summary: "Focus on mid-market companies.",
    recommendedChanges: [
      {
        field: "targetCompanySize",
        currentValue: "1-10",
        suggestedValue: "50-200",
        reasoning: "Higher reply rate observed",
      },
    ],
    confidence: 0.7,
  };

  it("accepts a valid output", () => {
    expect(() => analyzeStrategyOutputSchema.parse(valid)).not.toThrow();
  });

  it("accepts an empty recommendedChanges array", () => {
    expect(() =>
      analyzeStrategyOutputSchema.parse({ ...valid, recommendedChanges: [] })
    ).not.toThrow();
  });

  it("has no persistence/activation field — recommendations only", () => {
    expect(Object.keys(analyzeStrategyOutputSchema.shape).sort()).toEqual([
      "confidence",
      "recommendedChanges",
      "summary",
    ]);
  });
});
