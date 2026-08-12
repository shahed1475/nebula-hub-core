import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const timestampSchema = z.string();
export const jsonbSchema = z.record(z.string(), z.unknown());
