import { z } from "zod";

export const confidenceSchema = z.number().min(0).max(1);
export const nonEmptyString = z.string().min(1);
