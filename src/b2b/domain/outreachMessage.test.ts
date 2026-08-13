import { describe, expect, it } from "vitest";
import { outreachMessageSchema } from "./outreachMessage";

const validMessage = {
  id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  campaign_lead_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  channel: "email",
  direction: "outbound" as const,
  subject: "Quick question about your dev roadmap",
  body: "Hi Jane, ...",
  status: "draft" as const,
  scheduled_at: null,
  sent_at: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("outreachMessageSchema", () => {
  it("accepts a valid outreach message", () => {
    expect(outreachMessageSchema.parse(validMessage)).toEqual(validMessage);
  });

  it("rejects an invalid status", () => {
    expect(() =>
      outreachMessageSchema.parse({ ...validMessage, status: "delivered" })
    ).toThrow();
  });

  it("rejects a direction other than outbound", () => {
    expect(() =>
      outreachMessageSchema.parse({ ...validMessage, direction: "inbound" })
    ).toThrow();
  });
});
