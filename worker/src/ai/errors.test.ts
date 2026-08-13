import { describe, expect, it } from "vitest";
import {
  AIProviderError,
  AIProviderConfigError,
  AIProviderRefusalError,
  AIProviderValidationError,
  AIProviderRateLimitError,
  AIProviderAuthenticationError,
  AIProviderRequestError,
  parseOrThrow,
} from "./errors.js";

describe("AIProvider error hierarchy", () => {
  it("every specific error extends AIProviderError", () => {
    expect(new AIProviderConfigError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRefusalError("x", null)).toBeInstanceOf(AIProviderError);
    expect(new AIProviderValidationError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRateLimitError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderAuthenticationError("x")).toBeInstanceOf(AIProviderError);
    expect(new AIProviderRequestError("x")).toBeInstanceOf(AIProviderError);
  });

  it("AIProviderRefusalError carries the refusal category", () => {
    const error = new AIProviderRefusalError("declined", "cyber");
    expect(error.category).toBe("cyber");
  });

  it("AIProviderRefusalError allows a null category", () => {
    const error = new AIProviderRefusalError("declined", null);
    expect(error.category).toBeNull();
  });

  it("each error type has a distinct name matching its class", () => {
    expect(new AIProviderConfigError("x").name).toBe("AIProviderConfigError");
    expect(new AIProviderRateLimitError("x").name).toBe("AIProviderRateLimitError");
    expect(new AIProviderAuthenticationError("x").name).toBe("AIProviderAuthenticationError");
    expect(new AIProviderRequestError("x").name).toBe("AIProviderRequestError");
    expect(new AIProviderValidationError("x").name).toBe("AIProviderValidationError");
  });

  it("wraps an underlying cause when provided", () => {
    const cause = new Error("original");
    const error = new AIProviderRequestError("wrapped", { cause });
    expect(error.cause).toBe(cause);
  });
});

describe("parseOrThrow", () => {
  it("returns the parsed value when the schema accepts the input", () => {
    const schema = { parse: (input: unknown) => input };
    expect(parseOrThrow(schema, "ok")).toBe("ok");
  });

  it("wraps a thrown ZodError in AIProviderValidationError", () => {
    const schema = {
      parse: () => {
        throw new Error("simulated zod failure");
      },
    };
    expect(() => parseOrThrow(schema, "bad")).toThrow(AIProviderValidationError);
  });
});
