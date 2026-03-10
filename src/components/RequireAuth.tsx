import { Navigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";

/** Redirects to /login if user is not logged in. Use for select-role, become-model, register. */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
