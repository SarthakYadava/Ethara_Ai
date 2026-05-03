import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import * as usersController from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/", requireAuth, usersController.listUsers);
