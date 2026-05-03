import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isBooting } = useAuth();

  if (isBooting) {
    return <div className="boot-screen">Loading workspace...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
