import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { AIProvider } from "./AIProvider.js";
import type { EffortLevel } from "../config/env.js";
import {
  AIProviderAuthenticationError,
  AIProviderError,
  AIProviderRateLimitError,
  AIProviderRefusalError,
  AIProviderRequestError,
  AIProviderValidationError,
} from "./errors.js";
import {
  analyzeCompanyInputSchema,
  analyzeCompanyOutputSchema,
  type AnalyzeCompanyInput,
  type AnalyzeCompanyOutput,
  researchContactInputSchema,
  researchContactOutputSchema,
  type ResearchContactInput,
  type ResearchContactOutput,
  qualifyLeadInputSchema,
  qualifyLeadOutputSchema,
  type QualifyLeadInput,
  type QualifyLeadOutput,
  generateOutreachInputSchema,
  generateOutreachOutputSchema,
  type GenerateOutreachInput,
  type GenerateOutreachOutput,
  classifyReplyInputSchema,
  classifyReplyOutputSchema,
  type ClassifyReplyInput,
  type ClassifyReplyOutput,
  generateReplyInputSchema,
  generateReplyOutputSchema,
  type GenerateReplyInput,
  type GenerateReplyOutput,
  analyzeStrategyInputSchema,
  analyzeStrategyOutputSchema,
  type AnalyzeStrategyInput,
  type AnalyzeStrategyOutput,
} from "./schemas/index.js";

export interface AnthropicMessagesLike {
  messages: {
    parse(params: Record<string, unknown>): Promise<{
      parsed_output: unknown;
      stop_reason: string;
      stop_details?: { category?: string | null } | null;
    }>;
  };
}

export interface ClaudeAIProviderOptions {
  client: AnthropicMessagesLike;
  model: string;
  effort: EffortLevel;
}

export class ClaudeAIProvider implements AIProvider {
  private readonly client: AnthropicMessagesLike;
  private readonly model: string;
  private readonly effort: EffortLevel;

  constructor(options: ClaudeAIProviderOptions) {
    this.client = options.client;
    this.model = options.model;
    this.effort = options.effort;
  }

  private async runStructured<TOutput>(
    system: string,
    userPrompt: string,
    outputSchema: z.ZodType<TOutput>
  ): Promise<TOutput> {
    let response;
    try {
      response = await this.client.messages.parse({
        model: this.model,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: userPrompt }],
        output_config: {
          format: zodOutputFormat(outputSchema),
          effort: this.effort,
        },
      });
    } catch (error) {
      throw mapSdkError(error);
    }

    if (response.stop_reason === "refusal") {
      throw new AIProviderRefusalError(
        "Claude declined to complete this request.",
        response.stop_details?.category ?? null
      );
    }

    if (response.parsed_output === null || response.parsed_output === undefined) {
      throw new AIProviderValidationError(
        "Claude's response could not be parsed against the expected schema."
      );
    }

    const validated = outputSchema.safeParse(response.parsed_output);
    if (!validated.success) {
      throw new AIProviderValidationError(
        `Claude's response failed schema validation: ${validated.error.message}`,
        { cause: validated.error }
      );
    }

    return validated.data;
  }

  async analyzeCompany(rawInput: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput> {
    const input = analyzeCompanyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B research analyst. Analyze the company described and return structured findings.",
      `Company name: ${input.companyName}\nDomain: ${input.domain ?? "unknown"}\nIndustry: ${input.industry ?? "unknown"}\nDescription: ${input.description ?? "none"}\nAdditional context: ${input.rawContext ?? "none"}`,
      analyzeCompanyOutputSchema
    );
  }

  async researchContact(rawInput: ResearchContactInput): Promise<ResearchContactOutput> {
    const input = researchContactInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B research analyst. Analyze the contact described and return structured findings.",
      `Full name: ${input.fullName}\nTitle: ${input.title ?? "unknown"}\nCompany: ${input.companyName}\nAdditional context: ${input.rawContext ?? "none"}`,
      researchContactOutputSchema
    );
  }

  async qualifyLead(rawInput: QualifyLeadInput): Promise<QualifyLeadOutput> {
    const input = qualifyLeadInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales qualification analyst. Score this lead against the given ICP criteria.",
      `Company summary: ${input.companySummary}\nCompany pain points: ${input.companyPainPoints.join(", ") || "none"}\nCompany ICP fit signals: ${input.companyIcpFitSignals.join(", ") || "none"}\nContact summary: ${input.contactSummary ?? "unknown"}\nContact pain points: ${input.contactPainPoints.join(", ") || "none"}\nICP criteria: ${JSON.stringify(input.icpCriteria)}`,
      qualifyLeadOutputSchema
    );
  }

  async generateOutreach(rawInput: GenerateOutreachInput): Promise<GenerateOutreachOutput> {
    const input = generateOutreachInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales copywriter. Draft a single outreach message. This is a DRAFT ONLY — it will never be sent automatically and always requires human review and approval before any send.",
      `Company: ${input.companyName}\nContact: ${input.contactName}${input.contactTitle ? ` (${input.contactTitle})` : ""}\nChannel: ${input.channel}\nCompany pain points: ${input.companyPainPoints.join(", ") || "none"}\nPersonalization hooks: ${input.personalizationHooks.join(", ") || "none"}\nMessaging themes: ${input.messagingThemes?.join(", ") ?? "none"}`,
      generateOutreachOutputSchema
    );
  }

  async classifyReply(rawInput: ClassifyReplyInput): Promise<ClassifyReplyOutput> {
    const input = classifyReplyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales reply classifier. Classify the intent and sentiment of this inbound reply.",
      `Reply content: ${input.rawContent}\nOriginal message summary: ${input.originalMessageSummary ?? "unknown"}`,
      classifyReplyOutputSchema
    );
  }

  async generateReply(rawInput: GenerateReplyInput): Promise<GenerateReplyOutput> {
    const input = generateReplyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B sales copywriter. Draft a single follow-up reply. This is a DRAFT ONLY — it will never be sent automatically and always requires human review and approval before any send.",
      `Contact: ${input.contactName} at ${input.companyName}\nTheir message: ${input.rawContent}\nClassified intent: ${input.intent}\nClassified sentiment: ${input.sentiment}\nConversation summary: ${input.conversationSummary ?? "none"}`,
      generateReplyOutputSchema
    );
  }

  async analyzeStrategy(rawInput: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput> {
    const input = analyzeStrategyInputSchema.parse(rawInput);
    return this.runStructured(
      "You are a B2B growth strategy analyst. Recommend adjustments to the current targeting/messaging strategy based on measured performance. This is a set of RECOMMENDATIONS ONLY — you are not creating, updating, or activating any strategy configuration.",
      `Current config: ${JSON.stringify(input.currentConfig)}\nPerformance metrics: ${JSON.stringify(input.performanceMetrics)}`,
      analyzeStrategyOutputSchema
    );
  }
}

function mapSdkError(error: unknown): AIProviderError {
  const message = error instanceof Error ? error.message : String(error);
  const status =
    error && typeof error === "object" && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;

  if (status === 401) {
    return new AIProviderAuthenticationError(`Claude authentication failed: ${message}`, {
      cause: error,
    });
  }
  if (status === 429) {
    return new AIProviderRateLimitError(`Claude rate limit exceeded: ${message}`, {
      cause: error,
    });
  }
  return new AIProviderRequestError(`Claude request failed: ${message}`, { cause: error });
}
