import { z } from "zod";

const optionalDescriptionSchema = z
  .string()
  .trim()
  .max(600, "Description must be 600 characters or less")
  .optional()
  .transform((value) => value || undefined);

export const projectIdParamSchema = z.object({
  projectId: z.string().min(1)
});

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters").max(120),
  description: optionalDescriptionSchema
});

export const updateProjectSchema = createProjectSchema.partial();

export const memberSchema = z.object({
  userId: z.string().min(1)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
