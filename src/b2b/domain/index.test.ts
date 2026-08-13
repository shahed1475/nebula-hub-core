import { describe, expect, it } from "vitest";
import * as domain from "./index";

describe("b2b domain barrel export", () => {
  it("exports every table schema", () => {
    expect(domain.leadSourceSchema).toBeDefined();
    expect(domain.companySchema).toBeDefined();
    expect(domain.contactSchema).toBeDefined();
    expect(domain.strategySchema).toBeDefined();
    expect(domain.strategyVersionSchema).toBeDefined();
    expect(domain.leadSchema).toBeDefined();
    expect(domain.researchSchema).toBeDefined();
    expect(domain.leadScoreSchema).toBeDefined();
    expect(domain.campaignSchema).toBeDefined();
    expect(domain.campaignLeadSchema).toBeDefined();
    expect(domain.outreachMessageSchema).toBeDefined();
    expect(domain.outreachMessageEventSchema).toBeDefined();
    expect(domain.replySchema).toBeDefined();
    expect(domain.meetingSchema).toBeDefined();
    expect(domain.agentTaskSchema).toBeDefined();
    expect(domain.agentRunSchema).toBeDefined();
    expect(domain.analyticsEventSchema).toBeDefined();
  });

  it("exports the pipeline guards", () => {
    expect(domain.canApproveOutreach).toBeDefined();
    expect(domain.isValidLeadStatusTransition).toBeDefined();
  });
});
