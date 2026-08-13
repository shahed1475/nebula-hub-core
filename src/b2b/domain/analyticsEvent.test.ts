import { describe, expect, it } from "vitest";
import { analyticsEventSchema } from "./analyticsEvent";

const validEvent = {
  id: "20202020-2020-2020-2020-202020202020",
  event_type: "meeting_booked",
  subject_type: "lead",
  subject_id: "66666666-6666-6666-6666-666666666666",
  strategy_version_id: null,
  metadata: {},
  occurred_at: "2026-08-13T00:00:00Z",
};

describe("analyticsEventSchema", () => {
  it("accepts a valid analytics event", () => {
    expect(analyticsEventSchema.parse(validEvent)).toEqual(validEvent);
  });

  it("rejects an empty event_type", () => {
    expect(() =>
      analyticsEventSchema.parse({ ...validEvent, event_type: "" })
    ).toThrow();
  });
});
