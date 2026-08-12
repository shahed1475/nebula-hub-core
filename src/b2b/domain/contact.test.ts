import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const validContact = {
  id: "33333333-3333-3333-3333-333333333333",
  company_id: "22222222-2222-2222-2222-222222222222",
  full_name: "Jane Doe",
  title: "VP Engineering",
  email: "jane@acme.com",
  phone: null,
  linkedin_url: null,
  is_primary: true,
  source_id: null,
  opted_out: false,
  opted_out_at: null,
  metadata: {},
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("contactSchema", () => {
  it("accepts a valid contact", () => {
    expect(contactSchema.parse(validContact)).toEqual(validContact);
  });

  it("rejects an invalid email", () => {
    expect(() =>
      contactSchema.parse({ ...validContact, email: "not-an-email" })
    ).toThrow();
  });

  it("rejects a missing company_id", () => {
    const { company_id, ...withoutCompanyId } = validContact;
    expect(() => contactSchema.parse(withoutCompanyId)).toThrow();
  });
});
