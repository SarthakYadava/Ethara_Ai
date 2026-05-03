import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { projectIdParamSchema } from "../projects/projects.schemas.js";
import * as dashboardController from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/", dashboardController.getWorkspaceSummary);
dashboardRouter.get(
  "/projects/:projectId",
  validateRequest({ params: projectIdParamSchema }),
  dashboardController.getProjectSummary
);
