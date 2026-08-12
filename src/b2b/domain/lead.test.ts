import { describe, expect, it } from "vitest";
import { leadSchema } from "./lead";

const validLead = {
  id: "66666666-6666-6666-6666-666666666666",
  company_id: "22222222-2222-2222-2222-222222222222",
  contact_id: null,
  source_id: null,
  status: "new" as const,
  current_score: null,
  current_strategy_version_id: null,
  disqualified_reason: null,
  owner_id: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    expect(leadSchema.parse(validLead)).toEqual(validLead);
  });

  it("rejects an invalid status", () => {
    expect(() => leadSchema.parse({ ...validLead, status: "interested" })).toThrow();
  });

  it("rejects a missing company_id", () => {
    const { company_id, ...withoutCompanyId } = validLead;
    expect(() => leadSchema.parse(withoutCompanyId)).toThrow();
  });

  it("accepts a null contact_id", () => {
    expect(() => leadSchema.parse({ ...validLead, contact_id: null })).not.toThrow();
  });
});
