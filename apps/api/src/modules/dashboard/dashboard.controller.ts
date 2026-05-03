import { asyncHandler } from "../../utils/async-handler.js";
import { routeParam } from "../../utils/route-params.js";
import * as dashboardService from "./dashboard.service.js";

export const getWorkspaceSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getWorkspaceSummary(req.user!);
  res.json({ summary });
});

export const getProjectSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getProjectSummary(req.user!, routeParam(req.params.projectId, "projectId"));
  res.json({ summary });
});
