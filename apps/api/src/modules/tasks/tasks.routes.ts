import { UserRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireRole } from "../../middleware/require-role.js";
import { validateRequest } from "../../middleware/validate-request.js";
import * as tasksController from "./tasks.controller.js";
import {
  createTaskSchema,
  projectTaskParamSchema,
  statusUpdateSchema,
  taskIdParamSchema,
  updateTaskSchema
} from "./tasks.schemas.js";

export const projectTasksRouter = Router({ mergeParams: true });
export const tasksRouter = Router();

projectTasksRouter.use(requireAuth);
projectTasksRouter.get(
  "/",
  validateRequest({ params: projectTaskParamSchema }),
  tasksController.listTasks
);
projectTasksRouter.post(
  "/",
  requireRole(UserRole.ADMIN),
  validateRequest({ params: projectTaskParamSchema, body: createTaskSchema }),
  tasksController.createTask
);

tasksRouter.use(requireAuth);
tasksRouter.patch(
  "/:taskId",
  validateRequest({ params: taskIdParamSchema, body: updateTaskSchema }),
  tasksController.updateTask
);
tasksRouter.patch(
  "/:taskId/status",
  validateRequest({ params: taskIdParamSchema, body: statusUpdateSchema }),
  tasksController.updateTaskStatus
);
tasksRouter.delete(
  "/:taskId",
  validateRequest({ params: taskIdParamSchema }),
  tasksController.deleteTask
);
