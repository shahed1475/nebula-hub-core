import { describe, expect, it } from "vitest";
import { researchContactInputSchema, researchContactOutputSchema } from "./researchContact.js";

describe("researchContactInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      researchContactInputSchema.parse({
        fullName: "Jane Doe",
        title: null,
        companyName: "Acme",
        rawContext: null,
      })
    ).not.toThrow();
  });

  it("rejects an empty fullName", () => {
    expect(() =>
      researchContactInputSchema.parse({ fullName: "", companyName: "Acme" })
    ).toThrow();
  });
});

describe("researchContactOutputSchema", () => {
  const valid = {
    summary: "Jane is a VP of Sales at Acme.",
    seniority: "executive",
    likelyPainPoints: ["Limited time"],
    personalizationHooks: ["Works at Acme"],
    confidence: 0.6,
  };

  it("accepts a valid output", () => {
    expect(() => researchContactOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() => researchContactOutputSchema.parse({ ...valid, confidence: -0.1 })).toThrow();
  });

  it("rejects a missing summary", () => {
    const { summary: _summary, ...rest } = valid;
    expect(() => researchContactOutputSchema.parse(rest)).toThrow();
  });
});
