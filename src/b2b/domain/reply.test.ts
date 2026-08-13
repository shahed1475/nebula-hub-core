import { describe, expect, it } from "vitest";
import { replySchema } from "./reply";

const validReply = {
  id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
  lead_id: "66666666-6666-6666-6666-666666666666",
  contact_id: null,
  in_reply_to_message_id: null,
  raw_content: "Thanks, can we talk next week?",
  received_at: "2026-08-13T00:00:00Z",
  intent: null,
  sentiment: null,
  created_at: "2026-08-13T00:00:00Z",
};

describe("replySchema", () => {
  it("accepts a valid reply", () => {
    expect(replySchema.parse(validReply)).toEqual(validReply);
  });

  it("rejects empty raw_content", () => {
    expect(() => replySchema.parse({ ...validReply, raw_content: "" })).toThrow();
  });

  it("rejects a missing lead_id", () => {
    const { lead_id, ...withoutLeadId } = validReply;
    expect(() => replySchema.parse(withoutLeadId)).toThrow();
  });
});
