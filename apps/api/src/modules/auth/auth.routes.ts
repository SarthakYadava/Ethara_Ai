import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { validateRequest } from "../../middleware/validate-request.js";
import * as authController from "./auth.controller.js";
import { loginSchema, signupSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/signup", validateRequest({ body: signupSchema }), authController.signup);
authRouter.post("/login", validateRequest({ body: loginSchema }), authController.login);
authRouter.get("/me", requireAuth, authController.me);
