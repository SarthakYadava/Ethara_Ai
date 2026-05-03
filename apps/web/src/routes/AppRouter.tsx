import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context";
import { AuthPage } from "../features/auth/AuthPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { Shell } from "../features/layout/Shell";
import { ProjectDetailPage } from "../features/projects/ProjectDetailPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { TeamPage } from "../features/team/TeamPage";
import { ProtectedRoute } from "./ProtectedRoute";

function LoginRoute() {
  const { session } = useAuth();
  return session ? <Navigate to="/" replace /> : <AuthPage />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="team" element={<TeamPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
