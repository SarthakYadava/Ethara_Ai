import { UserRole } from "@prisma/client";
import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { requireRole } from "../../middleware/require-role.js";
import { validateRequest } from "../../middleware/validate-request.js";
import * as projectsController from "./projects.controller.js";
import {
  createProjectSchema,
  memberSchema,
  projectIdParamSchema,
  updateProjectSchema
} from "./projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", projectsController.listProjects);
projectsRouter.post(
  "/",
  requireRole(UserRole.ADMIN),
  validateRequest({ body: createProjectSchema }),
  projectsController.createProject
);
projectsRouter.get(
  "/:projectId",
  validateRequest({ params: projectIdParamSchema }),
  projectsController.getProject
);
projectsRouter.patch(
  "/:projectId",
  requireRole(UserRole.ADMIN),
  validateRequest({ params: projectIdParamSchema, body: updateProjectSchema }),
  projectsController.updateProject
);
projectsRouter.delete(
  "/:projectId",
  requireRole(UserRole.ADMIN),
  validateRequest({ params: projectIdParamSchema }),
  projectsController.deleteProject
);
projectsRouter.post(
  "/:projectId/members",
  requireRole(UserRole.ADMIN),
  validateRequest({ params: projectIdParamSchema, body: memberSchema }),
  projectsController.addMember
);
projectsRouter.delete(
  "/:projectId/members/:userId",
  requireRole(UserRole.ADMIN),
  projectsController.removeMember
);
