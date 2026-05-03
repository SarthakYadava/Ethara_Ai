import { UserRole } from "@prisma/client";
import { AppError } from "../../middleware/error-handler.js";
import { hashPassword, verifyPassword } from "../../lib/passwords.js";
import { prisma } from "../../lib/prisma.js";
import { signAuthToken } from "../../lib/tokens.js";
import type { AuthUser } from "../../types/auth.js";
import type { LoginInput, SignupInput } from "./auth.schemas.js";

function toAuthUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function authResponse(user: AuthUser) {
  return {
    token: signAuthToken(user),
    user
  };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new AppError(409, "Email is already registered");
  }

  const userCount = await prisma.user.count();
  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: userCount === 0 ? UserRole.ADMIN : UserRole.MEMBER
    }
  });

  return authResponse(toAuthUser(user));
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isValid = await verifyPassword(input.password, user.passwordHash);

  if (!isValid) {
    throw new AppError(401, "Invalid email or password");
  }

  return authResponse(toAuthUser(user));
}

export function getCurrentUser(user: AuthUser) {
  return { user };
}
