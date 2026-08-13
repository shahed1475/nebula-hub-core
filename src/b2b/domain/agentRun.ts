import { z } from "zod";
import { jsonbSchema, timestampSchema, uuidSchema } from "./common";

export const agentRunStatus = z.enum(["running", "succeeded", "failed"]);
export const agentRunProvider = z.enum(["mock", "claude"]);

export const agentRunSchema = z.object({
  id: uuidSchema,
  task_id: uuidSchema,
  status: agentRunStatus,
  provider: agentRunProvider.nullable(),
  started_at: timestampSchema.nullable(),
  finished_at: timestampSchema.nullable(),
  output: jsonbSchema.nullable(),
  error: z.string().nullable(),
  duration_ms: z.number().int().nullable(),
  created_at: timestampSchema,
});

export type AgentRun = z.infer<typeof agentRunSchema>;
