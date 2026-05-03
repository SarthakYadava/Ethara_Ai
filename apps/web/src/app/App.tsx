import { Activity, CheckCircle2, Clock3, KanbanSquare, ShieldCheck, UsersRound } from "lucide-react";

const metrics = [
  { label: "Completion", value: "68%", icon: CheckCircle2 },
  { label: "Open tasks", value: "24", icon: KanbanSquare },
  { label: "Overdue", value: "3", icon: Clock3 },
  { label: "Team load", value: "7", icon: UsersRound }
];

const tasks = [
  { title: "Finalize launch checklist", status: "In progress", priority: "High", owner: "Maya" },
  { title: "Review blocked onboarding flow", status: "Blocked", priority: "Urgent", owner: "Aarav" },
  { title: "Publish handoff notes", status: "Todo", priority: "Medium", owner: "Maya" }
];

export function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">TT</div>
        <nav>
          <a className="active" href="/">Dashboard</a>
          <a href="/">Projects</a>
          <a href="/">Tasks</a>
          <a href="/">Team</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Launch Command Center</p>
            <h1>Project health dashboard</h1>
          </div>
          <div className="role-pill">
            <ShieldCheck size={16} />
            Admin
          </div>
        </header>

        <section className="metric-grid" aria-label="Project metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;
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
          <div className="panel task-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Active work</p>
                <h2>Priority queue</h2>
              </div>
              <Activity size={18} />
            </div>
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task-row" key={task.title}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.owner}</span>
                  </div>
                  <span className={`status status-${task.status.toLowerCase().replace(" ", "-")}`}>{task.status}</span>
                  <span className="priority">{task.priority}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="panel workload-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Team signal</p>
                <h2>Workload</h2>
              </div>
              <UsersRound size={18} />
            </div>
            <div className="load-row">
              <span>Maya</span>
              <div><i style={{ width: "72%" }} /></div>
              <strong>9</strong>
            </div>
            <div className="load-row">
              <span>Aarav</span>
              <div><i style={{ width: "42%" }} /></div>
              <strong>5</strong>
            </div>
            <div className="load-row">
              <span>Neha</span>
              <div><i style={{ width: "56%" }} /></div>
              <strong>7</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
