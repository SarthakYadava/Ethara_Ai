import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

export const taskIdParamSchema = z.object({
  taskId: z.string().min(1)
});

export const projectTaskParamSchema = z.object({
  projectId: z.string().min(1)
});

const dueDateSchema = z
  .string()
  .datetime()
  .optional()
  .nullable()
  .transform((value) => (value ? new Date(value) : null));

export const createTaskSchema = z.object({
  title: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: dueDateSchema,
  assigneeId: z.string().min(1).optional().nullable()
});

export const updateTaskSchema = createTaskSchema.partial();

export const statusUpdateSchema = z.object({
  status: z.nativeEnum(TaskStatus)
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
