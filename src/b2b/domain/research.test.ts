import { describe, expect, it } from "vitest";
import { researchSchema } from "./research";

const validResearch = {
  id: "77777777-7777-7777-7777-777777777777",
  subject_type: "company" as const,
  subject_id: "22222222-2222-2222-2222-222222222222",
  summary: "Series B SaaS company, 80 employees",
  findings: { funding_stage: "series_b" },
  confidence: 0.8,
  source: "manual",
  created_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("researchSchema", () => {
  it("accepts a valid research record", () => {
    expect(researchSchema.parse(validResearch)).toEqual(validResearch);
  });

  it("rejects an invalid subject_type", () => {
    expect(() =>
      researchSchema.parse({ ...validResearch, subject_type: "deal" })
    ).toThrow();
  });

  it("rejects confidence outside 0..1", () => {
    expect(() =>
      researchSchema.parse({ ...validResearch, confidence: 1.5 })
    ).toThrow();
  });
});
