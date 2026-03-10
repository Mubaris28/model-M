import { Navigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/lib/authFlow";

/** Only allow verification-pending page if user has completed all forms (profileComplete) and is pending/updated. */
export default function VerificationPendingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const status = (user.status || "").toLowerCase();
  const canSee = user.profileComplete && (status === "pending" || status === "updated");
  if (!canSee) return <Navigate to={getRedirectPath(user)} replace />;
  return <>{children}</>;
}
