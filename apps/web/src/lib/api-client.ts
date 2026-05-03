import type { DashboardSummary, Project, Session, Task, TaskStatus, User } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  signup(input: { name: string; email: string; password: string }) {
    return request<Session>("/auth/signup", { method: "POST", body: input });
  },
  login(input: { email: string; password: string }) {
    return request<Session>("/auth/login", { method: "POST", body: input });
  },
  me(token: string) {
    return request<{ user: User }>("/auth/me", { token });
  },
  dashboard(token: string) {
    return request<{ summary: DashboardSummary }>("/dashboard", { token });
  },
  projectDashboard(token: string, projectId: string) {
    return request<{ summary: DashboardSummary }>(`/dashboard/projects/${projectId}`, { token });
  },
  users(token: string) {
    return request<{ users: User[] }>("/users", { token });
  },
  projects(token: string) {
    return request<{ projects: Project[] }>("/projects", { token });
  },
  createProject(token: string, input: { name: string; description?: string }) {
    return request<{ project: Project }>("/projects", { method: "POST", token, body: input });
  },
  addMember(token: string, projectId: string, userId: string) {
    return request(`/projects/${projectId}/members`, { method: "POST", token, body: { userId } });
  },
  tasks(token: string, projectId: string) {
    return request<{ tasks: Task[] }>(`/projects/${projectId}/tasks`, { token });
  },
  createTask(
    token: string,
    projectId: string,
    input: { title: string; description?: string; status?: TaskStatus; priority?: string; assigneeId?: string; dueDate?: string }
  ) {
    return request<{ task: Task }>(`/projects/${projectId}/tasks`, { method: "POST", token, body: input });
  },
  updateTaskStatus(token: string, taskId: string, status: TaskStatus) {
    return request<{ task: Task }>(`/tasks/${taskId}/status`, { method: "PATCH", token, body: { status } });
  }
};
