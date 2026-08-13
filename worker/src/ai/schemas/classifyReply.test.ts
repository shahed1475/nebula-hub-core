import { describe, expect, it } from "vitest";
import { classifyReplyInputSchema, classifyReplyOutputSchema } from "./classifyReply.js";

describe("classifyReplyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      classifyReplyInputSchema.parse({ rawContent: "Not interested", originalMessageSummary: null })
    ).not.toThrow();
  });

  it("rejects empty rawContent", () => {
    expect(() =>
      classifyReplyInputSchema.parse({ rawContent: "", originalMessageSummary: null })
    ).toThrow();
  });
});

describe("classifyReplyOutputSchema", () => {
  const valid = {
    intent: "not_interested" as const,
    sentiment: "negative" as const,
    summary: "The contact declined.",
    suggestedNextAction: null,
  };

  it("accepts a valid output", () => {
    expect(() => classifyReplyOutputSchema.parse(valid)).not.toThrow();
  });

  it("rejects an invalid intent", () => {
    expect(() => classifyReplyOutputSchema.parse({ ...valid, intent: "curious" })).toThrow();
  });

  it("rejects an invalid sentiment", () => {
    expect(() => classifyReplyOutputSchema.parse({ ...valid, sentiment: "meh" })).toThrow();
  });
});
