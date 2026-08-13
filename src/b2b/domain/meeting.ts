import { z } from "zod";
import { timestampSchema, uuidSchema } from "./common";

export const meetingStatus = z.enum(["proposed", "confirmed", "completed", "no_show", "cancelled"]);
export const meetingSource = z.enum(["manual", "booking_agent"]);

export const meetingSchema = z.object({
  id: uuidSchema,
  lead_id: uuidSchema,
  contact_id: uuidSchema.nullable(),
  status: meetingStatus,
  scheduled_at: timestampSchema.nullable(),
  meeting_link: z.string().nullable(),
  source: meetingSource,
  notes: z.string().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type Meeting = z.infer<typeof meetingSchema>;
