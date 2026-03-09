// In dev, Vite proxies /api to backend (3001). In prod, set VITE_API_URL to your API origin.
const API_URL = import.meta.env.VITE_API_URL ?? "";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit & { body?: object } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText || "Request failed");
  return data as T;
}

export const authApi = {
  signup: (body: { email: string; password: string; fullName?: string; phone?: string }) =>
    api<{ user: User; token: string }>("/api/auth/signup", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    api<{ user: User; token: string }>("/api/auth/login", { method: "POST", body }),
  adminLogin: (body: { email: string; password: string }) =>
    api<{ user: User; token: string }>("/api/auth/admin/login", { method: "POST", body }),
  me: () => api<{ user: User }>("/api/auth/me"),
  checkAdmin: () => api<{ isAdmin: boolean }>("/api/auth/check-admin"),
};

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function setAuthToken(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export const contactApi = {
  send: (body: { name: string; email: string; message: string }) =>
    api<{ message: string }>("/api/contact", { method: "POST", body }),
};

export const adminApi = {
  stats: () => api<AdminStats>("/api/admin/stats"),
  users: (params?: { status?: string; role?: string; profile?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<User[]>("/api/admin/users" + (q ? `?${q}` : ""));
  },
  user: (id: string) => api<User>("/api/admin/users/" + id),
  updateUser: (id: string, body: { status?: string }) =>
    api<User>("/api/admin/users/" + id, { method: "PATCH", body }),
  castings: (params?: { status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Casting[]>("/api/admin/castings" + (q ? `?${q}` : ""));
  },
};

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  role?: string;
  status?: string;
  profileComplete?: boolean;
  isAdmin?: boolean;
  company?: string;
  createdAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  totalModels: number;
  totalProfessionals: number;
  totalCastings: number;
  pendingCastings: number;
  totalContacts: number;
}

export interface Casting {
  _id: string;
  title: string;
  description?: string;
  castingType?: string;
  location?: string;
  date?: string;
  slots?: number;
  brand?: string;
  approvalStatus?: string;
  creatorId?: User;
  createdAt?: string;
}
