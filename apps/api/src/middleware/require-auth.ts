import type { RequestHandler } from "express";
import { AppError } from "./error-handler.js";
import { verifyAuthToken } from "../lib/tokens.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
};
