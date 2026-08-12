import { describe, expect, it } from "vitest";
import { leadScoreSchema } from "./leadScore";

const validLeadScore = {
  id: "88888888-8888-8888-8888-888888888888",
  lead_id: "66666666-6666-6666-6666-666666666666",
  score: 72,
  band: "warm",
  reasoning: "Good company size fit, no confirmed budget yet",
  strategy_version_id: null,
  scored_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("leadScoreSchema", () => {
  it("accepts a valid lead score", () => {
    expect(leadScoreSchema.parse(validLeadScore)).toEqual(validLeadScore);
  });

  it("rejects a missing score", () => {
    const { score, ...withoutScore } = validLeadScore;
    expect(() => leadScoreSchema.parse(withoutScore)).toThrow();
  });

  it("rejects an invalid scored_by value", () => {
    expect(() =>
      leadScoreSchema.parse({ ...validLeadScore, scored_by: "robot" })
    ).toThrow();
  });
});
