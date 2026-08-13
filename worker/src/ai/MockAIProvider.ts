import type { AIProvider } from "./AIProvider.js";
import { parseOrThrow } from "./errors.js";
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

export class MockAIProvider implements AIProvider {
  async analyzeCompany(rawInput: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput> {
    const input = parseOrThrow(analyzeCompanyInputSchema, rawInput);
    return analyzeCompanyOutputSchema.parse({
      summary: `${input.companyName} is a company in the ${input.industry ?? "unknown"} industry (mock analysis).`,
      companySizeEstimate: "11-50",
      industry: input.industry ?? null,
      techStack: ["Unknown"],
      fundingStage: null,
      painPoints: ["Manual processes", "Scaling challenges"],
      icpFitSignals: ["Matches target industry"],
      confidence: 0.5,
    });
  }

  async researchContact(rawInput: ResearchContactInput): Promise<ResearchContactOutput> {
    const input = parseOrThrow(researchContactInputSchema, rawInput);
    return researchContactOutputSchema.parse({
      summary: `${input.fullName} works at ${input.companyName}${input.title ? ` as ${input.title}` : ""} (mock research).`,
      seniority: input.title ? "manager" : null,
      likelyPainPoints: ["Limited time", "Too many tools"],
      personalizationHooks: [`Works at ${input.companyName}`],
      confidence: 0.5,
    });
  }

  async qualifyLead(rawInput: QualifyLeadInput): Promise<QualifyLeadOutput> {
    const input = parseOrThrow(qualifyLeadInputSchema, rawInput);
    return qualifyLeadOutputSchema.parse({
      score: 50,
      band: "warm",
      reasoning: `Mock qualification based on: ${input.companySummary.slice(0, 60)}`,
      disqualifyReason: null,
    });
  }

  async generateOutreach(rawInput: GenerateOutreachInput): Promise<GenerateOutreachOutput> {
    const input = parseOrThrow(generateOutreachInputSchema, rawInput);
    return generateOutreachOutputSchema.parse({
      subject: `Quick question for ${input.contactName}`,
      body: `Hi ${input.contactName},\n\nThis is a mock draft outreach message for ${input.companyName}.\n\n(MockAIProvider — not sent, draft only.)`,
      channel: input.channel,
    });
  }

  async classifyReply(rawInput: ClassifyReplyInput): Promise<ClassifyReplyOutput> {
    const input = parseOrThrow(classifyReplyInputSchema, rawInput);
    return classifyReplyOutputSchema.parse({
      intent: "other",
      sentiment: "neutral",
      summary: `Mock classification of reply: ${input.rawContent.slice(0, 60)}`,
      suggestedNextAction: null,
    });
  }

  async generateReply(rawInput: GenerateReplyInput): Promise<GenerateReplyOutput> {
    const input = parseOrThrow(generateReplyInputSchema, rawInput);
    return generateReplyOutputSchema.parse({
      body: `Hi ${input.contactName},\n\nThanks for your reply. (Mock draft reply — not sent.)`,
    });
  }

  async analyzeStrategy(rawInput: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput> {
    const input = parseOrThrow(analyzeStrategyInputSchema, rawInput);
    return analyzeStrategyOutputSchema.parse({
      summary: `Mock strategy analysis: ${input.performanceMetrics.totalLeads} leads processed.`,
      recommendedChanges: [],
      confidence: 0.5,
    });
  }
}
