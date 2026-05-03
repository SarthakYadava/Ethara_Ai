import { asyncHandler } from "../../utils/async-handler.js";
import { routeParam } from "../../utils/route-params.js";
import * as projectsService from "./projects.service.js";

export const listProjects = asyncHandler(async (req, res) => {
  const projects = await projectsService.listProjects(req.user!);
  res.json({ projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectsService.getProject(req.user!, routeParam(req.params.projectId, "projectId"));
  res.json({ project });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectsService.createProject(req.user!, req.body);
  res.status(201).json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectsService.updateProject(routeParam(req.params.projectId, "projectId"), req.body);
  res.json({ project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectsService.deleteProject(routeParam(req.params.projectId, "projectId"));
  res.status(204).send();
});

export const addMember = asyncHandler(async (req, res) => {
  const member = await projectsService.addMember(routeParam(req.params.projectId, "projectId"), req.body);
  res.status(201).json({ member });
});

export const removeMember = asyncHandler(async (req, res) => {
  await projectsService.removeMember(
    routeParam(req.params.projectId, "projectId"),
    routeParam(req.params.userId, "userId")
  );
  res.status(204).send();
});
