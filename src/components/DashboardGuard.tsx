import { Navigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath, canAccessDashboard } from "@/lib/authFlow";

/** Protects dashboard routes: redirects to select-role / forms / verification if user hasn't completed flow. */
export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!canAccessDashboard(user)) return <Navigate to={getRedirectPath(user)} replace />;
  return <>{children}</>;
}
