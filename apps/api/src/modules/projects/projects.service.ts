import { UserRole } from "@prisma/client";
import { devStore } from "../../lib/dev-store.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error-handler.js";
import type { AuthUser } from "../../types/auth.js";
import { ensureProjectAccess } from "./project-access.js";
import type { CreateProjectInput, MemberInput, UpdateProjectInput } from "./projects.schemas.js";

const projectInclude = {
  members: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  },
  _count: {
    select: {
      tasks: true,
      members: true
    }
  }
};

export async function listProjects(user: AuthUser) {
  try {
    return await prisma.project.findMany({
      where:
        user.role === UserRole.ADMIN
          ? undefined
          : {
              members: {
                some: { userId: user.id }
              }
            },
      include: projectInclude,
      orderBy: { updatedAt: "desc" }
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.listProjects(user);
  }
}

export async function getProject(user: AuthUser, projectId: string) {
  try {
    await ensureProjectAccess(user, projectId);

    return prisma.project.findUnique({
      where: { id: projectId },
      include: projectInclude
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.getProject(projectId);
  }
}

export async function createProject(user: AuthUser, input: CreateProjectInput) {
  try {
    return await prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        members: {
          create: {
            userId: user.id
          }
        }
      },
      include: projectInclude
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.createProject(user, input);
  }
}

export async function updateProject(projectId: string, input: UpdateProjectInput) {
  try {
    return await prisma.project.update({
      where: { id: projectId },
      data: input,
      include: projectInclude
    });
  } catch {
    throw new AppError(404, "Project not found");
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({ where: { id: projectId } });
  } catch {
    throw new AppError(404, "Project not found");
  }
}

export async function addMember(projectId: string, input: MemberInput) {
  try {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return prisma.projectMember.upsert({
      where: {
        userId_projectId: {
          userId: input.userId,
          projectId
        }
      },
      update: {},
      create: {
        userId: input.userId,
        projectId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    const member = devStore.addMember(projectId, input.userId);

    if (!member) {
      throw new AppError(404, "User not found");
    }

    return member;
  }
}

export async function removeMember(projectId: string, userId: string) {
  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });
  } catch {
    throw new AppError(404, "Project member not found");
  }
}
