import { describe, expect, it } from "vitest";
import { analyzeCompanyInputSchema, analyzeCompanyOutputSchema } from "./analyzeCompany.js";

describe("analyzeCompanyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      analyzeCompanyInputSchema.parse({
        companyName: "Acme",
        domain: null,
        industry: null,
        description: null,
        rawContext: null,
      })
    ).not.toThrow();
  });

  it("rejects an empty companyName", () => {
    expect(() => analyzeCompanyInputSchema.parse({ companyName: "" })).toThrow();
  });
});

describe("analyzeCompanyOutputSchema", () => {
  const valid = {
    summary: "Acme is a SaaS company.",
    companySizeEstimate: "11-50",
    industry: "Software",
    techStack: ["React"],
    fundingStage: "Series A",
    painPoints: ["Manual work"],
    icpFitSignals: ["Good fit"],
    confidence: 0.7,
  };

  it("accepts a valid output", () => {
    expect(() => analyzeCompanyOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() => analyzeCompanyOutputSchema.parse({ ...valid, confidence: 1.5 })).toThrow();
  });

  it("rejects a missing summary", () => {
    const { summary: _summary, ...rest } = valid;
    expect(() => analyzeCompanyOutputSchema.parse(rest)).toThrow();
  });
});
