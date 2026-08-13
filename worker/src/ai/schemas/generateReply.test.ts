import { describe, expect, it } from "vitest";
import { generateReplyInputSchema, generateReplyOutputSchema } from "./generateReply.js";

describe("generateReplyInputSchema", () => {
  it("accepts minimal valid input", () => {
    expect(() =>
      generateReplyInputSchema.parse({
        rawContent: "Tell me more",
        intent: "question",
        sentiment: "neutral",
        companyName: "Acme",
        contactName: "Jane",
        conversationSummary: null,
      })
    ).not.toThrow();
  });

  it("rejects an invalid intent", () => {
    expect(() =>
      generateReplyInputSchema.parse({
        rawContent: "Tell me more",
        intent: "curious",
        sentiment: "neutral",
        companyName: "Acme",
        contactName: "Jane",
        conversationSummary: null,
      })
    ).toThrow();
  });
});

describe("generateReplyOutputSchema", () => {
  it("accepts a valid output", () => {
    expect(() => generateReplyOutputSchema.parse({ body: "Thanks for reaching out." })).not.toThrow();
  });

  it("rejects an empty body", () => {
    expect(() => generateReplyOutputSchema.parse({ body: "" })).toThrow();
  });

  it("has exactly the draft field — no send/delivery field", () => {
    expect(Object.keys(generateReplyOutputSchema.shape)).toEqual(["body"]);
  });
});
