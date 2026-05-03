import { asyncHandler } from "../../utils/async-handler.js";
import * as authService from "./auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  const result = await authService.getCurrentUser(req.user!);
  res.json(result);
});
