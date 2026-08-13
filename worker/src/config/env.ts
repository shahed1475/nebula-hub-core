import { AIProviderConfigError } from "../ai/errors.js";

export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max";

const EFFORT_LEVELS: EffortLevel[] = ["low", "medium", "high", "xhigh", "max"];

export interface MockProviderEnv {
  provider: "mock";
}

export interface ClaudeProviderEnv {
  provider: "claude";
  apiKey: string;
  model: string;
  effort: EffortLevel;
}

export type WorkerEnv = MockProviderEnv | ClaudeProviderEnv;

export function loadWorkerEnv(
  source: Record<string, string | undefined> = process.env
): WorkerEnv {
  const providerRaw = source.AI_PROVIDER?.trim() || "mock";

  if (providerRaw === "mock") {
    return { provider: "mock" };
  }

  if (providerRaw !== "claude") {
    throw new AIProviderConfigError(
      `Invalid AI_PROVIDER "${providerRaw}" — must be "mock" or "claude".`
    );
  }

  const apiKey = source.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new AIProviderConfigError(
      "AI_PROVIDER=claude requires ANTHROPIC_API_KEY to be set."
    );
  }

  const model = source.ANTHROPIC_MODEL?.trim();
  if (!model) {
    throw new AIProviderConfigError(
      "AI_PROVIDER=claude requires ANTHROPIC_MODEL to be set — no default model is assumed."
    );
  }

  const effortRaw = source.ANTHROPIC_EFFORT?.trim() || "medium";
  if (!EFFORT_LEVELS.includes(effortRaw as EffortLevel)) {
    throw new AIProviderConfigError(
      `Invalid ANTHROPIC_EFFORT "${effortRaw}" — must be one of: ${EFFORT_LEVELS.join(", ")}.`
    );
  }

  return { provider: "claude", apiKey, model, effort: effortRaw as EffortLevel };
}
