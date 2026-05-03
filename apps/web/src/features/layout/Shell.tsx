import { LayoutDashboard, LogOut, PanelsTopLeft, UsersRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth-context";

export function Shell() {
  const { logout, session } = useAuth();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row compact">
          <span className="brand-mark">TT</span>
          <strong>EtharaBoard</strong>
        </div>
        <nav>
          <NavLink to="/" end>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/projects">
            <PanelsTopLeft size={18} />
            Projects
          </NavLink>
          <NavLink to="/team">
            <UsersRound size={18} />
            Team
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div>
            <strong>{session?.user.name}</strong>
            <span>{session?.user.role}</span>
          </div>
          <button className="icon-button" type="button" onClick={logout} title="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <section className="workspace">
        <Outlet />
      </section>
    </main>
  );
}
