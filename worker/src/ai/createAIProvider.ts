import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./AIProvider.js";
import { MockAIProvider } from "./MockAIProvider.js";
import { ClaudeAIProvider } from "./ClaudeAIProvider.js";
import { loadWorkerEnv, type WorkerEnv } from "../config/env.js";

export function createAIProvider(env: WorkerEnv = loadWorkerEnv()): AIProvider {
  if (env.provider === "mock") {
    return new MockAIProvider();
  }

  return new ClaudeAIProvider({
    client: new Anthropic({ apiKey: env.apiKey }),
    model: env.model,
    effort: env.effort,
  });
}
