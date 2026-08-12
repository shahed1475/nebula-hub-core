import { describe, expect, it } from "vitest";
import { companySchema } from "./company";

const validCompany = {
  id: "22222222-2222-2222-2222-222222222222",
  name: "Acme Inc",
  domain: "acme.com",
  industry: "Software",
  size_range: "11-50",
  country: "US",
  website: "https://acme.com",
  linkedin_url: null,
  description: null,
  metadata: {},
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("companySchema", () => {
  it("accepts a valid company", () => {
    expect(companySchema.parse(validCompany)).toEqual(validCompany);
  });

  it("rejects a missing name", () => {
    const { name, ...withoutName } = validCompany;
    expect(() => companySchema.parse(withoutName)).toThrow();
  });

  it("rejects an empty name", () => {
    expect(() => companySchema.parse({ ...validCompany, name: "" })).toThrow();
  });

  it("accepts a null domain", () => {
    expect(() =>
      companySchema.parse({ ...validCompany, domain: null })
    ).not.toThrow();
  });
});
