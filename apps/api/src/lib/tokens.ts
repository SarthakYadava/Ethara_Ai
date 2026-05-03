import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types/auth.js";

const TOKEN_EXPIRES_IN = "7d";

export function signAuthToken(user: AuthUser) {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthUser;
}
