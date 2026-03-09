import type { User } from "@/lib/api";

/**
 * Where to send the user after login/signup or when opening "/".
 * User must complete: select-role → become-model or register → verification-pending → dashboard (when approved).
 */
export function getRedirectPath(user: User | null): string {
  if (!user) return "/";

  if (user.isAdmin) return "/admin";

  const role = (user.role || "").toLowerCase();
  const status = (user.status || "").toLowerCase();

  if (role === "user" || !role) return "/select-role";
  if (role === "model" && !user.profileComplete) return "/become-model";
  if (role === "professional" && !user.profileComplete) return "/register";
  if (user.profileComplete && (status === "pending" || status === "updated")) return "/verification-pending";
  if (status === "changes_requested") return "/revise-application";
  if (status === "rejected") return "/rejected";

  return "/dashboard";
}

/** True if user is allowed to see the dashboard (approved and profile complete). */
export function canAccessDashboard(user: User | null): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  return user.profileComplete === true && (user.status || "").toLowerCase() === "approved";
}
