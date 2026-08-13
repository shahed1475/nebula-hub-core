import { describe, expect, it } from "vitest";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider, type AnthropicMessagesLike } from "./ClaudeAIProvider.js";
import {
  generateOutreachOutputSchema,
  generateReplyOutputSchema,
  analyzeStrategyOutputSchema,
} from "./schemas/index.js";

const FORBIDDEN_OUTREACH_KEYS = [
  "send",
  "dispatch",
  "deliver",
  "sentAt",
  "deliveredAt",
  "status",
  "recipient",
  "messageId",
];

const FORBIDDEN_STRATEGY_KEYS = [
  "id",
  "strategyId",
  "versionNumber",
  "isActive",
  "createdAt",
  "activate",
  "save",
];

describe("AIProvider contract: no outreach execution capability", () => {
  it("generateOutreach output schema has no send/delivery fields", () => {
    const keys = Object.keys(generateOutreachOutputSchema.shape);
    for (const forbidden of FORBIDDEN_OUTREACH_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("generateReply output schema has no send/delivery fields", () => {
    const keys = Object.keys(generateReplyOutputSchema.shape);
    for (const forbidden of FORBIDDEN_OUTREACH_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("analyzeStrategy output schema has no persistence/activation fields", () => {
    const keys = Object.keys(analyzeStrategyOutputSchema.shape);
    for (const forbidden of FORBIDDEN_STRATEGY_KEYS) {
      expect(keys).not.toContain(forbidden);
    }
  });

  it("MockAIProvider exposes no send/dispatch/deliver method", () => {
    const provider = new MockAIProvider() as unknown as Record<string, unknown>;
    expect(provider.send).toBeUndefined();
    expect(provider.dispatch).toBeUndefined();
    expect(provider.deliver).toBeUndefined();
  });

  it("ClaudeAIProvider exposes no send/dispatch/deliver method", () => {
    const fakeClient: AnthropicMessagesLike = {
      messages: { parse: async () => ({ stop_reason: "end_turn", parsed_output: null }) },
    };
    const provider = new ClaudeAIProvider({
      client: fakeClient,
      model: "claude-opus-5",
      effort: "medium",
    }) as unknown as Record<string, unknown>;
    expect(provider.send).toBeUndefined();
    expect(provider.dispatch).toBeUndefined();
    expect(provider.deliver).toBeUndefined();
  });
});

describe("AIProvider barrel export", () => {
  it("re-exports every schema, both providers, the factory, and every error class", async () => {
    const barrel = await import("./index.js");
    expect(barrel.analyzeCompanyOutputSchema).toBeDefined();
    expect(barrel.researchContactOutputSchema).toBeDefined();
    expect(barrel.qualifyLeadOutputSchema).toBeDefined();
    expect(barrel.generateOutreachOutputSchema).toBeDefined();
    expect(barrel.classifyReplyOutputSchema).toBeDefined();
    expect(barrel.generateReplyOutputSchema).toBeDefined();
    expect(barrel.analyzeStrategyOutputSchema).toBeDefined();
    expect(barrel.MockAIProvider).toBeDefined();
    expect(barrel.ClaudeAIProvider).toBeDefined();
    expect(barrel.createAIProvider).toBeDefined();
    expect(barrel.AIProviderError).toBeDefined();
    expect(barrel.AIProviderConfigError).toBeDefined();
    expect(barrel.AIProviderRefusalError).toBeDefined();
    expect(barrel.AIProviderValidationError).toBeDefined();
    expect(barrel.AIProviderRateLimitError).toBeDefined();
    expect(barrel.AIProviderAuthenticationError).toBeDefined();
    expect(barrel.AIProviderRequestError).toBeDefined();
  });
});
