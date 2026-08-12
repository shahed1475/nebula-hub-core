import type { LeadStatus } from "./lead";

export function canApproveOutreach(campaignLead: {
  approval_status: "pending" | "approved" | "rejected";
}): boolean {
  return campaignLead.approval_status === "approved";
}

const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "researching",
  "qualified",
  "approved_for_outreach",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal",
  "won",
];

const TERMINAL_STATUSES: LeadStatus[] = ["won", "lost", "disqualified"];
const EXIT_TARGETS: LeadStatus[] = ["disqualified", "lost"];

export function isValidLeadStatusTransition(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return false;
  if (TERMINAL_STATUSES.includes(from)) return false;
  if (EXIT_TARGETS.includes(to)) return true;

  const fromIndex = LEAD_STATUS_ORDER.indexOf(from);
  const toIndex = LEAD_STATUS_ORDER.indexOf(to);
  if (fromIndex === -1 || toIndex === -1) return false;

  return toIndex === fromIndex + 1;
}
