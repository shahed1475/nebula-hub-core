import { describe, expect, it } from "vitest";
import { strategyVersionSchema } from "./strategyVersion";

const validStrategyVersion = {
  id: "55555555-5555-5555-5555-555555555555",
  strategy_id: "44444444-4444-4444-4444-444444444444",
  version_number: 1,
  config: { target_industries: ["software"] },
  performance_snapshot: null,
  notes: null,
  created_by: "manual" as const,
  created_at: "2026-08-13T00:00:00Z",
};

describe("strategyVersionSchema", () => {
  it("accepts a valid strategy version", () => {
    expect(strategyVersionSchema.parse(validStrategyVersion)).toEqual(
      validStrategyVersion
    );
  });

  it("rejects an invalid created_by value", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, created_by: "robot" })
    ).toThrow();
  });

  it("rejects a non-integer version_number", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, version_number: 1.5 })
    ).toThrow();
  });

  it("rejects version_number less than 1", () => {
    expect(() =>
      strategyVersionSchema.parse({ ...validStrategyVersion, version_number: 0 })
    ).toThrow();
  });
});
