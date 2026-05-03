import { TaskStatus, UserRole } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import type { AuthUser } from "../../types/auth.js";
import { ensureProjectAccess } from "../projects/project-access.js";
import { isOverdue } from "../tasks/tasks.service.js";

function emptyStatusCounts() {
  return {
    TODO: 0,
    IN_PROGRESS: 0,
    REVIEW: 0,
    BLOCKED: 0,
    DONE: 0
  };
}

function summarizeTasks(tasks: Array<{ status: TaskStatus; dueDate: Date | null; assigneeId: string | null; assignee?: { name: string } | null }>) {
  const statusCounts = emptyStatusCounts();
  const workload = new Map<string, { assigneeId: string; name: string; count: number }>();

  for (const task of tasks) {
    statusCounts[task.status] += 1;

    if (task.assigneeId && task.assignee) {
      const current = workload.get(task.assigneeId) ?? {
        assigneeId: task.assigneeId,
        name: task.assignee.name,
        count: 0
      };
      current.count += 1;
      workload.set(task.assigneeId, current);
    }
  }

  const total = tasks.length;
  const completed = statusCounts.DONE;

  return {
    totalTasks: total,
    completedTasks: completed,
    overdueTasks: tasks.filter(isOverdue).length,
    blockedTasks: statusCounts.BLOCKED,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
    statusCounts,
    workload: [...workload.values()].sort((a, b) => b.count - a.count)
  };
}

export async function getWorkspaceSummary(user: AuthUser) {
  const tasks = await prisma.task.findMany({
    where:
      user.role === UserRole.ADMIN
        ? undefined
        : {
            OR: [
              { assigneeId: user.id },
              {
                project: {
                  members: {
                    some: { userId: user.id }
                  }
                }
              }
            ]
          },
    include: {
      assignee: {
        select: {
          name: true
        }
      }
    }
  });

  return summarizeTasks(tasks);
}

export async function getProjectSummary(user: AuthUser, projectId: string) {
  await ensureProjectAccess(user, projectId);

  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: {
        select: {
          name: true
        }
      }
    }
  });

  return summarizeTasks(tasks);
}
