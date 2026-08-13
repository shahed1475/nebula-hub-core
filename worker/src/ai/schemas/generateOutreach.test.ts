import { describe, expect, it } from "vitest";
import { generateOutreachInputSchema, generateOutreachOutputSchema } from "./generateOutreach.js";

describe("generateOutreachInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      generateOutreachInputSchema.parse({
        companyName: "Acme",
        contactName: "Jane",
        contactTitle: null,
        companyPainPoints: [],
        personalizationHooks: [],
        channel: "email",
        messagingThemes: null,
      })
    ).not.toThrow();
  });
});

describe("generateOutreachOutputSchema", () => {
  const valid = { subject: "Quick question", body: "Hi Jane, ...", channel: "email" };

  it("accepts a valid output", () => {
    expect(() => generateOutreachOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects an empty body", () => {
    expect(() => generateOutreachOutputSchema.parse({ ...valid, body: "" })).toThrow();
  });

  it("has exactly the draft fields — no send/delivery field", () => {
    expect(Object.keys(generateOutreachOutputSchema.shape).sort()).toEqual([
      "body",
      "channel",
      "subject",
    ]);
  });
});
