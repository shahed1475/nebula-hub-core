import { describe, expect, it } from "vitest";
import { createAIProvider } from "./createAIProvider.js";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider } from "./ClaudeAIProvider.js";

describe("createAIProvider", () => {
  it("returns a MockAIProvider for provider: mock", () => {
    const provider = createAIProvider({ provider: "mock" });
    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it("returns a ClaudeAIProvider for provider: claude", () => {
    const provider = createAIProvider({
      provider: "claude",
      apiKey: "sk-ant-test",
      model: "claude-opus-5",
      effort: "medium",
    });
    expect(provider).toBeInstanceOf(ClaudeAIProvider);
  });

  it("defaults to loadWorkerEnv() (mock) when called with no arguments and no AI_PROVIDER set", () => {
    const originalValue = process.env.AI_PROVIDER;
    delete process.env.AI_PROVIDER;
    try {
      const provider = createAIProvider();
      expect(provider).toBeInstanceOf(MockAIProvider);
    } finally {
      if (originalValue === undefined) {
        delete process.env.AI_PROVIDER;
      } else {
        process.env.AI_PROVIDER = originalValue;
      }
    }
  });
});
