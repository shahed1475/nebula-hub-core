import { describe, expect, it } from "vitest";
import { agentRunSchema } from "./agentRun";

const validRun = {
  id: "10101010-1010-1010-1010-101010101010",
  task_id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
  status: "succeeded" as const,
  provider: "mock" as const,
  started_at: "2026-08-13T00:00:00Z",
  finished_at: "2026-08-13T00:00:05Z",
  output: { summary: "done" },
  error: null,
  duration_ms: 5000,
  created_at: "2026-08-13T00:00:00Z",
};

describe("agentRunSchema", () => {
  it("accepts a valid agent run", () => {
    expect(agentRunSchema.parse(validRun)).toEqual(validRun);
  });

  it("rejects an invalid status", () => {
    expect(() => agentRunSchema.parse({ ...validRun, status: "queued" })).toThrow();
  });

  it("rejects an invalid provider", () => {
    expect(() =>
      agentRunSchema.parse({ ...validRun, provider: "openai" })
    ).toThrow();
  });
});
