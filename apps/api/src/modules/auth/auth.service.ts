import { UserRole } from "@prisma/client";
import { devStore } from "../../lib/dev-store.js";
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
  try {
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
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    const existing = devStore.findUserByEmail(input.email);

    if (existing) {
      throw new AppError(409, "Email is already registered");
    }

    return authResponse(devStore.authUser(devStore.createUser(input)));
  }
}

export async function login(input: LoginInput) {
  try {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const isValid = await verifyPassword(input.password, user.passwordHash);

    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    return authResponse(toAuthUser(user));
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    const user = devStore.findUserByEmail(input.email);

    if (!user || user.password !== input.password) {
      throw new AppError(401, "Invalid email or password");
    }

    return authResponse(devStore.authUser(user));
  }
}

export async function getCurrentUser(user: AuthUser) {
  try {
    const freshUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!freshUser) {
      throw new AppError(404, "User not found");
    }

    return { user: toAuthUser(freshUser) };
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    const freshUser = devStore.findUserById(user.id);

    if (!freshUser) {
      throw new AppError(404, "User not found");
    }

    return { user: devStore.authUser(freshUser) };
  }
}
