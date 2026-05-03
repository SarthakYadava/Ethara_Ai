import { AlertTriangle, CheckCircle2, Clock3, KanbanSquare, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingState } from "../../components/LoadingState";
import { apiClient } from "../../lib/api-client";
import type { DashboardSummary, Project } from "../../types/api";
import { useAuth } from "../auth/auth-context";

const metricIcons = [CheckCircle2, KanbanSquare, Clock3, AlertTriangle];

export function DashboardPage() {
  const { session } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!session) {
        return;
      }

      setIsLoading(true);

      try {
        const [summaryResult, projectResult] = await Promise.all([
          apiClient.dashboard(session.token),
          apiClient.projects(session.token)
        ]);

        if (isMounted) {
          setSummary(summaryResult.summary);
          setProjects(projectResult.projects);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const metrics = [
    { label: "Completion", value: `${summary?.completionRate ?? 0}%` },
    { label: "Total tasks", value: summary?.totalTasks ?? 0 },
    { label: "Overdue", value: summary?.overdueTasks ?? 0 },
    { label: "Blocked", value: summary?.blockedTasks ?? 0 }
  ];

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Workspace signal</p>
          <h1>{session?.user.role === "ADMIN" ? "Project health dashboard" : "My assigned work"}</h1>
        </div>
        <div className="role-pill">{session?.user.role}</div>
      </header>

      <section className="metric-grid" aria-label="Workspace metrics">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return (
            <article className="metric-card" key={metric.label}>
              <Icon size={20} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          );
        })}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Active projects</p>
              <h2>Workspaces</h2>
            </div>
            <Link className="text-button" to="/projects">View all</Link>
          </div>
          {isLoading ? (
            <LoadingState label="Loading projects" />
          ) : (
            <div className="project-list">
              {projects.map((project) => (
              <Link className="project-row" to={`/projects/${project.id}`} key={project.id}>
                <div>
                  <strong>{project.name}</strong>
                  <span>{project.description ?? "No description yet"}</span>
                </div>
                <span>{project._count.tasks} tasks</span>
              </Link>
              ))}
            </div>
          )}
        </article>

        <article className="panel workload-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Team load</p>
              <h2>Ownership</h2>
            </div>
            <UsersRound size={18} />
          </div>
          {isLoading ? (
            <LoadingState label="Loading workload" />
          ) : (
            (summary?.workload ?? []).map((item) => (
              <div className="load-row" key={item.assigneeId}>
                <span>{item.name}</span>
                <div><i style={{ width: `${Math.min(item.count * 12, 100)}%` }} /></div>
                <strong>{item.count}</strong>
              </div>
            ))
          )}
        </article>
      </section>
    </>
  );
}
