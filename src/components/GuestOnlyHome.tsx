import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/lib/authFlow";

/** For route "/": show public home only when not logged in; otherwise redirect to next step (select-role, forms, or dashboard). */
export default function GuestOnlyHome({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (user && location.pathname === "/") return <Navigate to={getRedirectPath(user)} replace />;
  return <>{children}</>;
}
