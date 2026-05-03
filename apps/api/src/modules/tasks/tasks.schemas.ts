import { TaskPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const optionalDescriptionSchema = z
  .string()
  .trim()
  .max(1000, "Description must be 1000 characters or less")
  .optional()
  .transform((value) => value || undefined);

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
  title: z.string().trim().min(2, "Task title must be at least 2 characters").max(160),
  description: optionalDescriptionSchema,
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
