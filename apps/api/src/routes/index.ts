import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { dashboardRouter } from "../modules/dashboard/dashboard.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";
import { projectTasksRouter, tasksRouter } from "../modules/tasks/tasks.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/projects/:projectId/tasks", projectTasksRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/dashboard", dashboardRouter);
