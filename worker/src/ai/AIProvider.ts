import type {
  AnalyzeCompanyInput,
  AnalyzeCompanyOutput,
  ResearchContactInput,
  ResearchContactOutput,
  QualifyLeadInput,
  QualifyLeadOutput,
  GenerateOutreachInput,
  GenerateOutreachOutput,
  ClassifyReplyInput,
  ClassifyReplyOutput,
  GenerateReplyInput,
  GenerateReplyOutput,
  AnalyzeStrategyInput,
  AnalyzeStrategyOutput,
} from "./schemas/index.js";

export interface AIProvider {
  analyzeCompany(input: AnalyzeCompanyInput): Promise<AnalyzeCompanyOutput>;
  researchContact(input: ResearchContactInput): Promise<ResearchContactOutput>;
  qualifyLead(input: QualifyLeadInput): Promise<QualifyLeadOutput>;
  generateOutreach(input: GenerateOutreachInput): Promise<GenerateOutreachOutput>;
  classifyReply(input: ClassifyReplyInput): Promise<ClassifyReplyOutput>;
  generateReply(input: GenerateReplyInput): Promise<GenerateReplyOutput>;
  analyzeStrategy(input: AnalyzeStrategyInput): Promise<AnalyzeStrategyOutput>;
}
