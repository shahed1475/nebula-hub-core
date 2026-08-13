import { describe, expect, it } from "vitest";
import { loadWorkerEnv } from "./env.js";
import { AIProviderConfigError } from "../ai/errors.js";

describe("loadWorkerEnv", () => {
  it("defaults to mock when AI_PROVIDER is unset", () => {
    const env = loadWorkerEnv({});
    expect(env).toEqual({ provider: "mock" });
  });

  it("defaults to mock when AI_PROVIDER is explicitly mock", () => {
    const env = loadWorkerEnv({ AI_PROVIDER: "mock" });
    expect(env).toEqual({ provider: "mock" });
  });

  it("throws AIProviderConfigError for an unknown AI_PROVIDER value", () => {
    expect(() => loadWorkerEnv({ AI_PROVIDER: "openai" })).toThrow(AIProviderConfigError);
  });

  it("throws AIProviderConfigError when AI_PROVIDER=claude and ANTHROPIC_API_KEY is missing", () => {
    expect(() =>
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_MODEL: "claude-opus-5" })
    ).toThrow(AIProviderConfigError);
  });

  it("throws AIProviderConfigError when AI_PROVIDER=claude and ANTHROPIC_MODEL is missing", () => {
    expect(() =>
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_API_KEY: "sk-ant-test" })
    ).toThrow(AIProviderConfigError);
  });

  it("does not silently pick a default model when ANTHROPIC_MODEL is missing", () => {
    expect.assertions(2);
    try {
      loadWorkerEnv({ AI_PROVIDER: "claude", ANTHROPIC_API_KEY: "sk-ant-test" });
    } catch (error) {
      expect(error).toBeInstanceOf(AIProviderConfigError);
      expect((error as Error).message).toMatch(/ANTHROPIC_MODEL/);
    }
  });

  it("returns valid claude config with default effort", () => {
    const env = loadWorkerEnv({
      AI_PROVIDER: "claude",
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_MODEL: "claude-opus-5",
    });
    expect(env).toEqual({
      provider: "claude",
      apiKey: "sk-ant-test",
      model: "claude-opus-5",
      effort: "medium",
    });
  });

  it("returns valid claude config with explicit effort", () => {
    const env = loadWorkerEnv({
      AI_PROVIDER: "claude",
      ANTHROPIC_API_KEY: "sk-ant-test",
      ANTHROPIC_MODEL: "claude-opus-5",
      ANTHROPIC_EFFORT: "xhigh",
    });
    expect(env.provider === "claude" && env.effort).toBe("xhigh");
  });

  it("throws AIProviderConfigError for an invalid ANTHROPIC_EFFORT value", () => {
    expect(() =>
      loadWorkerEnv({
        AI_PROVIDER: "claude",
        ANTHROPIC_API_KEY: "sk-ant-test",
        ANTHROPIC_MODEL: "claude-opus-5",
        ANTHROPIC_EFFORT: "ultra",
      })
    ).toThrow(AIProviderConfigError);
  });
});
