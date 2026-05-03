import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingState } from "../../components/LoadingState";
import { apiClient } from "../../lib/api-client";
import type { Project } from "../../types/api";
import { useAuth } from "../auth/auth-context";

export function ProjectsPage() {
  const { session } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  async function loadProjects() {
    if (!session) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiClient.projects(session.token);
      setProjects(result.projects);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [session]);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();

    if (!session) {
      return;
    }

    setIsCreating(true);

    try {
      await apiClient.createProject(session.token, form);
      setForm({ name: "", description: "" });
      await loadProjects();
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Projects</h1>
        </div>
      </header>

      {session?.user.role === "ADMIN" && (
        <form className="inline-form" onSubmit={handleCreate}>
          <input
            placeholder="Project name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
          <button className="primary-button compact-button" type="submit" disabled={isCreating}>
            {isCreating ? <span className="loading-spinner small" aria-hidden="true" /> : <Plus size={16} />}
            {isCreating ? "Creating" : "Create"}
          </button>
        </form>
      )}

      {isLoading ? (
        <LoadingState label="Loading projects" size="page" />
      ) : (
        <section className="project-grid">
          {projects.map((project) => (
            <Link className="project-card" to={`/projects/${project.id}`} key={project.id}>
              <strong>{project.name}</strong>
              <p>{project.description ?? "No description yet"}</p>
              <div>
                <span>{project._count.tasks} tasks</span>
                <span>{project._count.members} members</span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
