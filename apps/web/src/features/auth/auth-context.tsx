import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiClient } from "../../lib/api-client";
import { clearStoredSession, readStoredSession, writeStoredSession } from "../../lib/session-storage";
import type { Session } from "../../types/api";

type AuthContextValue = {
  session: Session | null;
  isBooting: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readStoredSession());
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    async function refreshSession() {
      if (!session?.token) {
        setIsBooting(false);
        return;
      }

      try {
        const result = await apiClient.me(session.token);
        const nextSession = { token: session.token, user: result.user };
        setSession(nextSession);
        writeStoredSession(nextSession);
      } catch {
        clearStoredSession();
        setSession(null);
      } finally {
        setIsBooting(false);
      }
    }

    refreshSession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isBooting,
      async login(input) {
        const nextSession = await apiClient.login(input);
        setSession(nextSession);
        writeStoredSession(nextSession);
      },
      async signup(input) {
        const nextSession = await apiClient.signup(input);
        setSession(nextSession);
        writeStoredSession(nextSession);
      },
      logout() {
        clearStoredSession();
        setSession(null);
      }
    }),
    [session, isBooting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
