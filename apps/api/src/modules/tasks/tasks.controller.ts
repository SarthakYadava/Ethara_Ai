import { asyncHandler } from "../../utils/async-handler.js";
import { routeParam } from "../../utils/route-params.js";
import * as tasksService from "./tasks.service.js";

export const listTasks = asyncHandler(async (req, res) => {
  const tasks = await tasksService.listTasks(req.user!, routeParam(req.params.projectId, "projectId"));
  res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await tasksService.createTask(req.user!, routeParam(req.params.projectId, "projectId"), req.body);
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTask(req.user!, routeParam(req.params.taskId, "taskId"), req.body);
  res.json({ task });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTaskStatus(req.user!, routeParam(req.params.taskId, "taskId"), req.body);
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  await tasksService.deleteTask(req.user!, routeParam(req.params.taskId, "taskId"));
  res.status(204).send();
});
