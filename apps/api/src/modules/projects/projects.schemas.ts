import { z } from "zod";

export const projectIdParamSchema = z.object({
  projectId: z.string().min(1)
});

export const createProjectSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(600).optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export const memberSchema = z.object({
  userId: z.string().min(1)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
