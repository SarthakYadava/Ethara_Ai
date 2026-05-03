import { UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error-handler.js";
import type { AuthUser } from "../../types/auth.js";

export async function ensureProjectAccess(user: AuthUser, projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true }
  });

  if (!project) {
    throw new AppError(404, "Project not found");
  }

  if (user.role === UserRole.ADMIN) {
    return;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId
      }
    }
  });

  if (!membership) {
    throw new AppError(403, "You are not a member of this project");
  }
}
