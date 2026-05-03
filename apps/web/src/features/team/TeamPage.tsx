import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingState } from "../../components/LoadingState";
import { apiClient } from "../../lib/api-client";
import type { User } from "../../types/api";
import { useAuth } from "../auth/auth-context";

export function TeamPage() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      if (!session) {
        return;
      }

      setIsLoading(true);

      try {
        const result = await apiClient.users(session.token);
        setUsers(result.users);
      } finally {
        setIsLoading(false);
      }
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

      {isLoading ? (
        <LoadingState label="Loading team" size="page" />
      ) : (
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
      )}
    </>
  );
}
