import { describe, expect, it } from "vitest";
import { meetingSchema } from "./meeting";

const validMeeting = {
  id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
  lead_id: "66666666-6666-6666-6666-666666666666",
  contact_id: null,
  status: "proposed" as const,
  scheduled_at: null,
  meeting_link: null,
  source: "manual" as const,
  notes: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("meetingSchema", () => {
  it("accepts a valid meeting", () => {
    expect(meetingSchema.parse(validMeeting)).toEqual(validMeeting);
  });

  it("rejects an invalid status", () => {
    expect(() => meetingSchema.parse({ ...validMeeting, status: "tentative" })).toThrow();
  });

  it("rejects an invalid source", () => {
    expect(() => meetingSchema.parse({ ...validMeeting, source: "ai" })).toThrow();
  });
});
