import { TaskPriority, TaskStatus, UserRole } from "@prisma/client";
import type { AuthUser } from "../types/auth.js";

type DemoProject = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DemoTask = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

const admin = {
  id: "demo-admin",
  name: "Sarthak Admin",
  email: "admin@demo.com",
  role: UserRole.ADMIN,
  password: "Admin@123",
  createdAt: new Date()
};

const member = {
  id: "demo-member",
  name: "Maya Member",
  email: "member@demo.com",
  role: UserRole.MEMBER,
  password: "Member@123",
  createdAt: new Date()
};

const users = [admin, member];

const projects: DemoProject[] = [
  {
    id: "demo-project-command-center",
    name: "Launch Command Center",
    description: "Demo workspace for project health, ownership, and delivery tracking.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const memberships = [
  { id: "demo-membership-admin", userId: admin.id, projectId: projects[0].id, joinedAt: new Date() },
  { id: "demo-membership-member", userId: member.id, projectId: projects[0].id, joinedAt: new Date() }
];

let tasks: DemoTask[] = [
  {
    id: "demo-task-checklist",
    title: "Finalize launch checklist",
    description: "Confirm owner, deadline, and acceptance notes before launch.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    projectId: projects[0].id,
    assigneeId: member.id,
    creatorId: admin.id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-task-blocked",
    title: "Review blocked onboarding flow",
    description: "Identify why signup confirmation is waiting on copy approval.",
    status: TaskStatus.BLOCKED,
    priority: TaskPriority.URGENT,
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
    projectId: projects[0].id,
    assigneeId: admin.id,
    creatorId: admin.id,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "demo-task-handoff",
    title: "Publish handoff notes",
    description: "Summarize project context for the delivery team.",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    projectId: projects[0].id,
    assigneeId: member.id,
    creatorId: admin.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function publicUser(user: (typeof users)[number]) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function userById(userId: string | null) {
  return users.find((user) => user.id === userId) ?? null;
}

function projectPayload(project: DemoProject) {
  const projectMemberships = memberships.filter((membership) => membership.projectId === project.id);

  return {
    ...project,
    members: projectMemberships.map((membership) => ({
      id: membership.id,
      user: publicUser(userById(membership.userId)!)
    })),
    _count: {
      tasks: tasks.filter((task) => task.projectId === project.id).length,
      members: projectMemberships.length
    }
  };
}

function taskPayload(task: DemoTask) {
  return {
    ...task,
    assignee: task.assigneeId ? publicUser(userById(task.assigneeId)!) : null,
    creator: publicUser(userById(task.creatorId)!)
  };
}

export const devStore = {
  isUnavailable(error: unknown) {
    if (process.env.NODE_ENV === "production") {
      return false;
    }

    const message = error instanceof Error ? error.message : String(error);
    return message.includes("Can't reach database server") || message.includes("PrismaClientInitializationError");
  },
  findUserByEmail(email: string) {
    return users.find((user) => user.email === email) ?? null;
  },
  findUserById(userId: string) {
    return users.find((user) => user.id === userId) ?? null;
  },
  createUser(input: { name: string; email: string; password: string }) {
    const user = {
      id: `demo-user-${Date.now()}`,
      name: input.name,
      email: input.email,
      password: input.password,
      role: UserRole.MEMBER,
      createdAt: new Date()
    };
    users.push(user);
    return publicUser(user);
  },
  authUser(user: DemoUser): AuthUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  },
  listUsers() {
    return users.map(publicUser).sort((a, b) => a.name.localeCompare(b.name));
  },
  listProjects(user: AuthUser) {
    return projects
      .filter((project) => user.role === UserRole.ADMIN || memberships.some((item) => item.projectId === project.id && item.userId === user.id))
      .map(projectPayload);
  },
  getProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    return project ? projectPayload(project) : null;
  },
  createProject(user: AuthUser, input: { name: string; description?: string }) {
    const project = {
      id: `demo-project-${Date.now()}`,
      name: input.name,
      description: input.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    projects.push(project);
    memberships.push({ id: `demo-membership-${Date.now()}`, userId: user.id, projectId: project.id, joinedAt: new Date() });
    return projectPayload(project);
  },
  addMember(projectId: string, userId: string) {
    const user = userById(userId);

    if (!user) {
      return null;
    }

    const existing = memberships.find((item) => item.projectId === projectId && item.userId === userId);

    if (existing) {
      return { id: existing.id, user: publicUser(user) };
    }

    const membership = { id: `demo-membership-${Date.now()}`, userId, projectId, joinedAt: new Date() };
    memberships.push(membership);
    return { id: membership.id, user: publicUser(user) };
  },
  listTasks(projectId: string) {
    return tasks.filter((task) => task.projectId === projectId).map(taskPayload);
  },
  createTask(projectId: string, creatorId: string, input: { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; dueDate?: Date | null; assigneeId?: string | null }) {
    const task = {
      id: `demo-task-${Date.now()}`,
      title: input.title,
      description: input.description ?? null,
      status: input.status ?? TaskStatus.TODO,
      priority: input.priority ?? TaskPriority.MEDIUM,
      dueDate: input.dueDate ?? null,
      projectId,
      assigneeId: input.assigneeId ?? null,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks = [task, ...tasks];
    return taskPayload(task);
  },
  updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task) {
      return null;
    }

    task.status = status;
    task.updatedAt = new Date();
    return taskPayload(task);
  },
  allTasks() {
    return tasks.map(taskPayload);
  },
  projectTasks(projectId: string) {
    return tasks.filter((task) => task.projectId === projectId).map(taskPayload);
  }
};
