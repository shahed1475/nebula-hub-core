import { describe, expect, it } from "vitest";
import { campaignLeadSchema } from "./campaignLead";
import { canApproveOutreach } from "./guards";

const validCampaignLead = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  campaign_id: "99999999-9999-9999-9999-999999999999",
  lead_id: "66666666-6666-6666-6666-666666666666",
  approval_status: "pending" as const,
  approved_by: null,
  approved_at: null,
  status: "queued" as const,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("campaignLeadSchema", () => {
  it("accepts a valid campaign lead", () => {
    expect(campaignLeadSchema.parse(validCampaignLead)).toEqual(validCampaignLead);
  });

  it("rejects an invalid approval_status", () => {
    expect(() =>
      campaignLeadSchema.parse({ ...validCampaignLead, approval_status: "maybe" })
    ).toThrow();
  });

  it("parses into a shape canApproveOutreach accepts", () => {
    const approved = campaignLeadSchema.parse({
      ...validCampaignLead,
      approval_status: "approved",
    });
    expect(canApproveOutreach(approved)).toBe(true);
  });
});
