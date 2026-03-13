// Next.js rewrites /api to backend (3001). Set NEXT_PUBLIC_API_URL in prod if API is on another origin.
// Must be full URL with protocol (e.g. https://your-api.onrender.com) or browser will treat it as a path.
const raw = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";
const API_URL = raw && !/^https?:\/\//i.test(raw) ? `https://${raw.replace(/^\/+/, "")}` : raw;

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: Omit<RequestInit, "body"> & { body?: object } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });
  } catch (err) {
    const msg = ((err as Error).message || "").toLowerCase();
    const isNetworkError =
      msg.includes("fetch") ||
      msg.includes("network") ||
      msg.includes("load failed") ||
      msg.includes("connection") ||
      msg.includes("refused") ||
      msg.includes("failed to fetch");
    if (isNetworkError) {
      throw new Error(
        "Cannot reach the server. If you're running locally, start the API with: npm run server (in a separate terminal)."
      );
    }
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    const body = data as { error?: string; message?: string; msg?: string };
    const message =
      body.error || body.message || body.msg || res.statusText || "Something went wrong. Please try again.";
    if (!isJson || (!body.error && !body.message && !body.msg)) {
      throw new Error(
        res.status === 0 || res.status >= 502
          ? "Cannot reach the server. If you're running locally, start the API with: npm run server (in a separate terminal)."
          : message
      );
    }
    throw new Error(message);
  }
  return data as T;
}

export const authApi = {
  signup: (body: { email: string; password: string; fullName?: string; phone?: string }) =>
    api<{ user: User; token: string }>("/api/auth/signup", { method: "POST", body }),
  login: (body: { email: string; password: string }) =>
    api<{ user: User; token: string }>("/api/auth/login", { method: "POST", body }),
  adminSignup: (body: { email: string; password: string; fullName?: string }) =>
    api<{ user: User; token: string }>("/api/auth/admin/signup", { method: "POST", body }),
  adminLogin: (body: { email: string; password: string }) =>
    api<{ user: User; token: string }>("/api/auth/admin/login", { method: "POST", body }),
  me: () => api<{ user: User }>("/api/auth/me"),
  checkAdmin: () => api<{ isAdmin: boolean }>("/api/auth/check-admin"),
  updateProfile: (body: {
    role?: string;
    profileComplete?: boolean;
    status?: string;
    fullName?: string;
    phone?: string;
    company?: string;
    profilePhoto?: string;
    portfolio?: string[];
    idPhotoUrl?: string;
    selfieWithIdUrl?: string;
    bio?: string;
    country?: string;
    dateOfBirth?: string;
    gender?: string;
    city?: string;
    height?: string;
    weight?: string;
    dressSize?: string;
    shoeSize?: string;
    eyeColor?: string;
    hairColor?: string;
    categories?: string[];
    instagram?: string;
    idNumber?: string;
  }) => api<{ user: User }>("/api/auth/me", { method: "PATCH", body }),
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

function getUploadBaseUrl(): string {
  if (typeof window !== "undefined") {
    const raw = (process.env?.NEXT_PUBLIC_API_URL as string) || "";
    const base = raw && !/^https?:\/\//i.test(raw) ? `https://${raw.replace(/^\/+/, "")}` : raw;
    return base;
  }
  return (process.env?.NEXT_PUBLIC_API_URL as string) || "";
}

export async function uploadFile(file: File, folder: "profile" | "portfolio" | "id" | "selfie"): Promise<string> {
  const token = getToken();
  if (!token) throw new Error("You must be logged in to upload.");
  const base = getUploadBaseUrl();
  const url = `${base ? base.replace(/\/$/, "") : ""}/api/upload?folder=${folder}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: (() => {
        const form = new FormData();
        form.append("file", file);
        return form;
      })(),
    });
  } catch (e) {
    const msg = (e as Error).message?.toLowerCase() || "";
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed"))
      throw new Error("Cannot reach server. Check your connection and try again.");
    throw e;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Upload failed. Please try again.");
  return (data as { url: string }).url;
}

export async function uploadFiles(files: File[], folder: "portfolio"): Promise<string[]> {
  const token = getToken();
  if (!token) throw new Error("You must be logged in to upload.");
  const base = getUploadBaseUrl();
  const url = `${base ? base.replace(/\/$/, "") : ""}/api/upload/multiple?folder=${folder}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: (() => {
        const form = new FormData();
        files.forEach((f) => form.append("files", f));
        return form;
      })(),
    });
  } catch (e) {
    const msg = (e as Error).message?.toLowerCase() || "";
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("failed"))
      throw new Error("Cannot reach server. Check your connection and try again.");
    throw e;
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || "Upload failed. Please try again.");
  return (data as { urls: string[] }).urls;
}

export const adminApi = {
  stats: () => api<AdminStats>("/api/admin/stats"),
  users: (params?: { status?: string; role?: string; profile?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<User[]>("/api/admin/users" + (q ? `?${q}` : ""));
  },
  user: (id: string) => api<User>("/api/admin/users/" + id),
  updateUser: (id: string, body: { status?: string; rejectionReason?: string }) =>
    api<User>("/api/admin/users/" + id, { method: "PATCH", body }),
  castings: (params?: { status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api<Casting[]>("/api/admin/castings" + (q ? `?${q}` : ""));
  },
  updateCasting: (id: string, body: { approvalStatus?: string; rejectionReason?: string }) =>
    api<Casting>("/api/admin/castings/" + id, { method: "PATCH", body }),
  contacts: (type?: "booking" | "application" | "partner" | "all") => {
    const q = type && type !== "all" ? `?type=${type}` : "";
    return api<ContactMessage[]>("/api/admin/contacts" + q);
  },
};

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

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
  rejectionReason?: string;
  profilePhoto?: string;
  portfolio?: string[];
  idPhotoUrl?: string;
  selfieWithIdUrl?: string;
  bio?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  city?: string;
  height?: string;
  weight?: string;
  dressSize?: string;
  shoeSize?: string;
  eyeColor?: string;
  hairColor?: string;
  categories?: string[];
  instagram?: string;
  idNumber?: string;
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

/** Public API (no auth). Approved models for /models and /new-faces. */
export interface PublicModel {
  _id: string;
  fullName?: string;
  profilePhoto?: string;
  portfolio?: string[];
  categories?: string[];
  country?: string;
  city?: string;
  height?: string;
  weight?: string;
  dressSize?: string;
  shoeSize?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  instagram?: string;
  role?: string;
  createdAt?: string;
}

export const publicApi = {
  models: () => api<PublicModel[]>("/api/public/models"),
  model: (id: string) => api<PublicModel>(`/api/public/models/${id}`),
  castings: () => api<PublicCasting[]>("/api/public/castings"),
};

export interface MyCasting {
  _id: string;
  title: string;
  description?: string;
  castingType?: string;
  location?: string;
  date?: string;
  slots?: number;
  brand?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export interface CastingBody {
  title: string;
  description?: string;
  castingType?: string;
  location?: string;
  date?: string;
  slots?: number;
  brand?: string;
}

export const castingApi = {
  create: (body: CastingBody) => api<MyCasting>("/api/castings", { method: "POST", body }),
  mine: () => api<MyCasting[]>("/api/castings/mine"),
  update: (id: string, body: Partial<CastingBody>) =>
    api<MyCasting>("/api/castings/" + id, { method: "PATCH", body }),
  remove: (id: string) => api<{ message: string }>("/api/castings/" + id, { method: "DELETE" }),
};

export interface PublicCasting {
  _id: string;
  title: string;
  description?: string;
  castingType?: string;
  location?: string;
  date?: string;
  slots?: number;
  brand?: string;
  approvalStatus?: string;
  createdAt?: string;
}
