import { useState } from "react";
import { CheckCircle2, LockKeyhole, UserPlus } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-context";

type Mode = "login" | "signup";

export function AuthPage() {
  const { login, signup, session } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "admin@demo.com", password: "Admin@123" });

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-preview">
        <div className="brand-row">
          <span className="brand-mark">TT</span>
          <strong>EtharaBoard</strong>
        </div>
        <div>
          <p className="eyebrow">Team command center</p>
          <h1>Run project work with ownership, urgency, and clarity.</h1>
        </div>
        <div className="preview-stack">
          <div className="preview-card">
            <CheckCircle2 size={18} />
            <span>68% complete</span>
            <strong>Launch Command Center</strong>
          </div>
          <div className="preview-card warning">
            <LockKeyhole size={18} />
            <span>Role-aware controls</span>
            <strong>Admin actions stay protected</strong>
          </div>
        </div>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <UserPlus size={22} />
            <div>
              <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
              <p>{mode === "login" ? "Use the demo admin account or your own." : "The first account becomes admin."}</p>
            </div>
          </div>

          <div className="segmented-control">
            <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => setMode("login")}>
              Login
            </button>
            <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => setMode("signup")}>
              Signup
            </button>
          </div>

          {mode === "signup" && (
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Working..." : mode === "login" ? "Enter workspace" : "Create workspace"}
          </button>
        </form>
      </section>
    </main>
  );
}
