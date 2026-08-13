import { describe, expect, it } from "vitest";
import { outreachMessageEventSchema } from "./outreachMessageEvent";

const validEvent = {
  id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
  message_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  event_type: "sent" as const,
  metadata: {},
  occurred_at: "2026-08-13T00:00:00Z",
};

describe("outreachMessageEventSchema", () => {
  it("accepts a valid message event", () => {
    expect(outreachMessageEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it("rejects an invalid event_type", () => {
    expect(() =>
      outreachMessageEventSchema.parse({ ...validEvent, event_type: "read" })
    ).toThrow();
  });
});
