import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const campaignLeadApprovalStatus = z.enum(["pending", "approved", "rejected"]);
export const campaignLeadStatus = z.enum(["queued", "sending", "sent", "paused", "removed"]);

export const campaignLeadSchema = z.object({
  id: uuidSchema,
  campaign_id: uuidSchema,
  lead_id: uuidSchema,
  approval_status: campaignLeadApprovalStatus,
  approved_by: uuidSchema.nullable(),
  approved_at: timestampSchema.nullable(),
  status: campaignLeadStatus,
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type CampaignLead = z.infer<typeof campaignLeadSchema>;
