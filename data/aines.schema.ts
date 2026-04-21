import { z } from "zod";

export const aineEntrySchema = z.object({
  name: z.string().min(1),
  aliases: z.array(z.string()).min(1),
  family: z.string().min(1),
});

export const aineBlacklistSchema = z.array(aineEntrySchema).min(1);

export type AineEntry = z.infer<typeof aineEntrySchema>;
export type AineBlacklist = z.infer<typeof aineBlacklistSchema>;
