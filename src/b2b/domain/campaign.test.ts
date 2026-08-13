import { describe, expect, it } from "vitest";
import { campaignSchema } from "./campaign";

const validCampaign = {
  id: "99999999-9999-9999-9999-999999999999",
  name: "Q1 Outbound - SaaS ICP",
  channel: "email",
  status: "draft" as const,
  strategy_version_id: null,
  created_by: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("campaignSchema", () => {
  it("accepts a valid campaign", () => {
    expect(campaignSchema.parse(validCampaign)).toEqual(validCampaign);
  });

  it("rejects an invalid status", () => {
    expect(() => campaignSchema.parse({ ...validCampaign, status: "live" })).toThrow();
  });

  it("rejects a missing channel", () => {
    const { channel, ...withoutChannel } = validCampaign;
    expect(() => campaignSchema.parse(withoutChannel)).toThrow();
  });
});
