export type UserRole = "ADMIN" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Session = {
  token: string;
  user: User;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  members: Array<{
    id: string;
    user: User;
  }>;
  _count: {
    tasks: number;
    members: number;
  };
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignee: User | null;
  creator: User;
};

export type DashboardSummary = {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  blockedTasks: number;
  completionRate: number;
  statusCounts: Record<TaskStatus, number>;
  workload: Array<{
    assigneeId: string;
    name: string;
    count: number;
  }>;
};
