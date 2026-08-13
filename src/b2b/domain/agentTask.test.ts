import { describe, expect, it } from "vitest";
import { agentTaskSchema } from "./agentTask";

const validTask = {
  id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
  task_type: "research" as const,
  status: "pending" as const,
  payload: { lead_id: "66666666-6666-6666-6666-666666666666" },
  subject_type: "lead",
  subject_id: "66666666-6666-6666-6666-666666666666",
  priority: 0,
  scheduled_for: "2026-08-13T00:00:00Z",
  claimed_at: null,
  claimed_by: null,
  attempts: 0,
  max_attempts: 3,
  created_at: "2026-08-13T00:00:00Z",
  updated_at: "2026-08-13T00:00:00Z",
};

describe("agentTaskSchema", () => {
  it("accepts a valid agent task", () => {
    expect(agentTaskSchema.parse(validTask)).toEqual(validTask);
  });

  it("rejects an invalid task_type", () => {
    expect(() =>
      agentTaskSchema.parse({ ...validTask, task_type: "sending" })
    ).toThrow();
  });

  it("rejects a negative attempts value", () => {
    expect(() => agentTaskSchema.parse({ ...validTask, attempts: -1 })).toThrow();
  });
});
