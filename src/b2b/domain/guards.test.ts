import { describe, expect, it } from "vitest";
import { isOutreachApproved, isValidLeadStatusTransition } from "./guards";

describe("isOutreachApproved", () => {
  it("returns true when approval_status is approved", () => {
    expect(isOutreachApproved({ approval_status: "approved" })).toBe(true);
  });

  it("returns false when approval_status is pending", () => {
    expect(isOutreachApproved({ approval_status: "pending" })).toBe(false);
  });

  it("returns false when approval_status is rejected", () => {
    expect(isOutreachApproved({ approval_status: "rejected" })).toBe(false);
  });
});

describe("isValidLeadStatusTransition", () => {
  it("allows the next sequential pipeline stage", () => {
    expect(isValidLeadStatusTransition("new", "researching")).toBe(true);
    expect(isValidLeadStatusTransition("proposal", "won")).toBe(true);
  });

  it("rejects skipping stages", () => {
    expect(isValidLeadStatusTransition("new", "won")).toBe(false);
  });

  it("rejects a no-op transition", () => {
    expect(isValidLeadStatusTransition("new", "new")).toBe(false);
  });

  it("allows exiting to disqualified or lost from any active stage", () => {
    expect(isValidLeadStatusTransition("contacted", "disqualified")).toBe(true);
    expect(isValidLeadStatusTransition("qualified", "lost")).toBe(true);
  });

  it("rejects leaving a terminal state", () => {
    expect(isValidLeadStatusTransition("won", "contacted")).toBe(false);
    expect(isValidLeadStatusTransition("disqualified", "new")).toBe(false);
    expect(isValidLeadStatusTransition("lost", "researching")).toBe(false);
  });

  it("rejects terminal-to-exit-target transitions (a terminal state cannot re-enter another terminal state)", () => {
    expect(isValidLeadStatusTransition("won", "lost")).toBe(false);
    expect(isValidLeadStatusTransition("won", "disqualified")).toBe(false);
    expect(isValidLeadStatusTransition("lost", "won")).toBe(false);
    expect(isValidLeadStatusTransition("lost", "disqualified")).toBe(false);
    expect(isValidLeadStatusTransition("disqualified", "won")).toBe(false);
    expect(isValidLeadStatusTransition("disqualified", "lost")).toBe(false);
  });
});
