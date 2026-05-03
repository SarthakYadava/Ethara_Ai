import { TaskStatus, UserRole } from "@prisma/client";
import { devStore } from "../../lib/dev-store.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../middleware/error-handler.js";
import type { AuthUser } from "../../types/auth.js";
import { ensureProjectAccess } from "../projects/project-access.js";
import type { CreateTaskInput, StatusUpdateInput, UpdateTaskInput } from "./tasks.schemas.js";

const taskInclude = {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  },
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  }
};

async function ensureAssigneeIsMember(projectId: string, assigneeId?: string | null) {
  if (!assigneeId) {
    return;
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: assigneeId,
        projectId
      }
    }
  });

  if (!membership) {
    throw new AppError(400, "Assignee must be a project member");
  }
}

export async function listTasks(user: AuthUser, projectId: string) {
  try {
    await ensureProjectAccess(user, projectId);

    return prisma.task.findMany({
      where: { projectId },
      include: taskInclude,
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }]
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.listTasks(projectId);
  }
}

export async function createTask(user: AuthUser, projectId: string, input: CreateTaskInput) {
  try {
    await ensureProjectAccess(user, projectId);
    await ensureAssigneeIsMember(projectId, input.assigneeId);

    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        dueDate: input.dueDate,
        assigneeId: input.assigneeId,
        creatorId: user.id,
        projectId
      },
      include: taskInclude
    });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    return devStore.createTask(projectId, user.id, input);
  }
}

export async function updateTask(user: AuthUser, taskId: string, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  await ensureProjectAccess(user, task.projectId);

  if (user.role !== UserRole.ADMIN) {
    if (task.assigneeId !== user.id) {
      throw new AppError(403, "Members can only update their assigned tasks");
    }

    const keys = Object.keys(input);
    if (keys.length !== 1 || !("status" in input)) {
      throw new AppError(403, "Members can only update task status");
    }
  }

  await ensureAssigneeIsMember(task.projectId, input.assigneeId);

  return prisma.task.update({
    where: { id: taskId },
    data: input,
    include: taskInclude
  });
}

export async function updateTaskStatus(user: AuthUser, taskId: string, input: StatusUpdateInput) {
  try {
    return await updateTask(user, taskId, { status: input.status });
  } catch (error) {
    if (!devStore.isUnavailable(error)) {
      throw error;
    }

    const task = devStore.updateTaskStatus(taskId, input.status);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return task;
  }
}

export async function deleteTask(user: AuthUser, taskId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  await ensureProjectAccess(user, task.projectId);

  if (user.role !== UserRole.ADMIN) {
    throw new AppError(403, "Only admins can delete tasks");
  }

  await prisma.task.delete({ where: { id: taskId } });
}

export function isOverdue(task: { dueDate: Date | null; status: TaskStatus }) {
  return Boolean(task.dueDate && task.dueDate < new Date() && task.status !== TaskStatus.DONE);
}
