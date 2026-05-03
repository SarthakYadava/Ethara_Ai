import type { RequestHandler } from "express";
import type { UserRole } from "@prisma/client";
import { AppError } from "./error-handler.js";

export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "You do not have access to this action"));
      return;
    }

    next();
  };
}
