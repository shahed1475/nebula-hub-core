import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const agentTaskType = z.enum([
  "strategy",
  "lead_finder",
  "research",
  "qualification",
  "outreach",
  "reply",
  "booking",
  "notification",
  "analytics",
]);

export const agentTaskStatus = z.enum([
  "pending",
  "claimed",
  "in_progress",
  "succeeded",
  "failed",
  "cancelled",
]);

export const agentTaskSchema = z.object({
  id: uuidSchema,
  task_type: agentTaskType,
  status: agentTaskStatus,
  payload: jsonbSchema,
  subject_type: z.string().nullable(),
  subject_id: uuidSchema.nullable(),
  priority: z.number().int(),
  scheduled_for: timestampSchema,
  claimed_at: timestampSchema.nullable(),
  claimed_by: z.string().nullable(),
  attempts: z.number().int().min(0),
  max_attempts: z.number().int().min(1),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export type AgentTask = z.infer<typeof agentTaskSchema>;
