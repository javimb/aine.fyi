import { z } from "zod";

export const LevelSchema = z.enum(["RED", "AMBER", "YELLOW", "GREEN"]);

export const PrincipleInfoSchema = z.object({
  level: LevelSchema,
  family: z.string(),
});

export const PrincipleClassificationSchema = z.record(
  z.string(),
  PrincipleInfoSchema,
);

export type Level = z.infer<typeof LevelSchema>;
export type PrincipleInfo = z.infer<typeof PrincipleInfoSchema>;
export type PrincipleClassification = z.infer<
  typeof PrincipleClassificationSchema
>;
