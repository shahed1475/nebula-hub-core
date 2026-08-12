import { describe, expect, it } from "vitest";
import { strategySchema } from "./strategy";

const validStrategy = {
  id: "44444444-4444-4444-4444-444444444444",
  name: "Default ICP Strategy",
  description: null,
  is_active: true,
  current_version_id: null,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("strategySchema", () => {
  it("accepts a valid strategy", () => {
    expect(strategySchema.parse(validStrategy)).toEqual(validStrategy);
  });

  it("rejects a missing name", () => {
    const { name, ...withoutName } = validStrategy;
    expect(() => strategySchema.parse(withoutName)).toThrow();
  });
});
