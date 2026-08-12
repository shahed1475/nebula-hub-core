import { describe, expect, it } from "vitest";
import { leadSourceSchema } from "./leadSource";

const validLeadSource = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Manual Entry",
  code: "manual",
  source_type: "manual",
  config: {},
  is_active: true,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("leadSourceSchema", () => {
  it("accepts a valid lead source", () => {
    expect(leadSourceSchema.parse(validLeadSource)).toEqual(validLeadSource);
  });

  it("rejects a missing code", () => {
    const { code, ...withoutCode } = validLeadSource;
    expect(() => leadSourceSchema.parse(withoutCode)).toThrow();
  });

  it("rejects a non-boolean is_active", () => {
    expect(() =>
      leadSourceSchema.parse({ ...validLeadSource, is_active: "yes" })
    ).toThrow();
  });
});
