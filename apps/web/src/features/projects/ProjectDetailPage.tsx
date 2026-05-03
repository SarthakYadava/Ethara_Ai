import { Plus, UserRoundPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingState } from "../../components/LoadingState";
import { apiClient } from "../../lib/api-client";
import type { Project, Task, TaskPriority, TaskStatus, User } from "../../types/api";
import { useAuth } from "../auth/auth-context";

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "BLOCKED", "DONE"];
const priorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const statusLabels: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  BLOCKED: "Blocked",
  DONE: "Done"
};

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const { session } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [memberId, setMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    assigneeId: "",
    dueDate: ""
  });

  async function loadProject() {
    if (!session || !projectId) {
      return;
    }

    setIsLoading(true);

    try {
      const [projectResult, taskResult, usersResult] = await Promise.all([
        apiClient.projects(session.token),
        apiClient.tasks(session.token, projectId),
        apiClient.users(session.token)
      ]);

      setProject(projectResult.projects.find((item) => item.id === projectId) ?? null);
      setTasks(taskResult.tasks);
      setUsers(usersResult.users);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
  }, [session, projectId]);

  const projectMemberIds = useMemo(() => new Set(project?.members.map((member) => member.user.id)), [project]);
  const availableUsers = users.filter((user) => !projectMemberIds.has(user.id));

  async function handleAddMember(event: React.FormEvent) {
    event.preventDefault();

    if (!session || !memberId) {
      return;
    }

    setIsAddingMember(true);

    try {
      await apiClient.addMember(session.token, projectId, memberId);
      setMemberId("");
      await loadProject();
    } finally {
      setIsAddingMember(false);
    }
  }

  async function handleCreateTask(event: React.FormEvent) {
    event.preventDefault();

    if (!session) {
      return;
    }

    setIsCreatingTask(true);

    try {
      await apiClient.createTask(session.token, projectId, {
        ...taskForm,
        assigneeId: taskForm.assigneeId || undefined,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined
      });
      setTaskForm({ title: "", description: "", priority: "MEDIUM", assigneeId: "", dueDate: "" });
      await loadProject();
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    if (!session) {
      return;
    }

    setUpdatingTaskId(taskId);

    try {
      await apiClient.updateTaskStatus(session.token, taskId, status);
      await loadProject();
    } finally {
      setUpdatingTaskId(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Project workspace</p>
          <h1>{project?.name ?? "Project"}</h1>
        </div>
      </header>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Task board</p>
              <h2>Status flow</h2>
            </div>
          </div>
          {isLoading ? (
            <LoadingState label="Loading project board" />
          ) : (
            <div className="board">
              {statuses.map((status) => (
                <section className="board-column" key={status}>
                  <h3>{statusLabels[status]}</h3>
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <article className="task-card" key={task.id}>
                        <strong>{task.title}</strong>
                        <p>{task.description ?? "No description"}</p>
                        <div className="task-meta">
                          <span className="priority">{task.priority}</span>
                          <span>{task.assignee?.name ?? "Unassigned"}</span>
                        </div>
                        <select
                          value={task.status}
                          disabled={updatingTaskId === task.id}
                          onChange={(event) => handleStatusChange(task.id, event.target.value as TaskStatus)}
                        >
                          {statuses.map((option) => (
                            <option value={option} key={option}>{statusLabels[option]}</option>
                          ))}
                        </select>
                        {updatingTaskId === task.id && <span className="inline-loading"><span className="loading-spinner small" /> Updating</span>}
                      </article>
                    ))}
                </section>
              ))}
            </div>
          )}
        </article>

        <aside className="side-stack">
          {session?.user.role === "ADMIN" && (
            <form className="panel stack-form" onSubmit={handleCreateTask}>
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">New work</p>
                  <h2>Create task</h2>
                </div>
                <Plus size={18} />
              </div>
              <input placeholder="Title" value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} required />
              <textarea placeholder="Description" value={taskForm.description} onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })} />
              <select value={taskForm.priority} onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value as TaskPriority })}>
                {priorities.map((priority) => <option value={priority} key={priority}>{priority}</option>)}
              </select>
              <select value={taskForm.assigneeId} onChange={(event) => setTaskForm({ ...taskForm, assigneeId: event.target.value })}>
                <option value="">Unassigned</option>
                {project?.members.map((member) => (
                  <option value={member.user.id} key={member.user.id}>{member.user.name}</option>
                ))}
              </select>
              <input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })} />
              <button className="primary-button" type="submit" disabled={isCreatingTask}>
                {isCreatingTask && <span className="loading-spinner small" aria-hidden="true" />}
                {isCreatingTask ? "Creating task" : "Create task"}
              </button>
            </form>
          )}

          <form className="panel stack-form" onSubmit={handleAddMember}>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Team</p>
                <h2>Members</h2>
              </div>
              <UserRoundPlus size={18} />
            </div>
            <div className="member-list">
              {project?.members.map((member) => (
                <span key={member.user.id}>{member.user.name}</span>
              ))}
            </div>
            {session?.user.role === "ADMIN" && (
              <>
                <select value={memberId} onChange={(event) => setMemberId(event.target.value)}>
                  <option value="">Add user</option>
                  {availableUsers.map((user) => (
                    <option value={user.id} key={user.id}>{user.name}</option>
                  ))}
                </select>
                <button className="secondary-button" type="submit" disabled={isAddingMember}>
                  {isAddingMember && <span className="loading-spinner small" aria-hidden="true" />}
                  {isAddingMember ? "Adding member" : "Add member"}
                </button>
              </>
            )}
          </form>
        </aside>
      </section>
    </>
  );
}
