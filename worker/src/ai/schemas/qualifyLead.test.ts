import { describe, expect, it } from "vitest";
import { qualifyLeadInputSchema, qualifyLeadOutputSchema } from "./qualifyLead.js";

describe("qualifyLeadInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      qualifyLeadInputSchema.parse({
        companySummary: "Acme is a SaaS company",
        companyPainPoints: [],
        companyIcpFitSignals: [],
        contactSummary: null,
        contactPainPoints: [],
        icpCriteria: {},
      })
    ).not.toThrow();
  });
});

describe("qualifyLeadOutputSchema", () => {
  const valid = {
    score: 72,
    band: "warm" as const,
    reasoning: "Good company size fit",
    disqualifyReason: null,
  };

  it("accepts a valid output", () => {
    expect(() => qualifyLeadOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects a score above 100", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, score: 150 })).toThrow();
  });

  it("rejects a non-integer score", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, score: 72.5 })).toThrow();
  });

  it("rejects an invalid band value", () => {
    expect(() => qualifyLeadOutputSchema.parse({ ...valid, band: "lukewarm" })).toThrow();
  });
});
