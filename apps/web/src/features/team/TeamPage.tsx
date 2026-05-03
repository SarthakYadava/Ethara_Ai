import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client";
import type { User } from "../../types/api";
import { useAuth } from "../auth/auth-context";

export function TeamPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      if (!session) {
        return;
      }

      const result = await apiClient.users(session.token);
      setUsers(result.users);
    }

    loadUsers();
  }, [session]);

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Directory</p>
          <h1>Team</h1>
        </div>
      </header>

      <section className="team-grid">
        {users.map((user) => (
          <article className="team-card" key={user.id}>
            <UsersRound size={18} />
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <em>{user.role}</em>
          </article>
        ))}
      </section>
    </>
  );
}
