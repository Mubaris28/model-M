import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, User, setAuthToken, clearAuthToken } from "@/lib/api";

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminSignup: (email: string, password: string, fullName?: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string, phone?: string) => Promise<void>;
  verifySignupOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setUser: (u: User | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const loadStored = useCallback(async () => {
    const t = localStorage.getItem("token");
    if (!t) {
      setToken(null);
      setUserState(null);
      setLoading(false);
      return;
    }
    setToken(t);
    try {
      const { user: u } = await authApi.me();
      setUserState(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
} catch {
    clearAuthToken();
      setToken(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: u, token: t } = await authApi.login({ email, password });
      setAuthToken(t, u);
      setToken(t);
      setUserState(u);
      return u;
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, fullName?: string, phone?: string) => {
      await authApi.signup({ email, password, fullName, phone });
      // OTP sent - auth state is set after verifySignupOtp
    },
    []
  );

  const verifySignupOtp = useCallback(
    async (email: string, otp: string) => {
      const { user: u, token: t } = await authApi.verifySignupOtp({ email, otp });
      setAuthToken(t, u);
      setToken(t);
      setUserState(u);
    },
    []
  );

  const adminLogin = useCallback(async (email: string, password: string) => {
    const { user: u, token: t } = await authApi.adminLogin({ email, password });
    setAuthToken(t, u);
    setToken(t);
    setUserState(u);
  }, []);

  const adminSignup = useCallback(async (email: string, password: string, fullName?: string) => {
    const { user: u, token: t } = await authApi.adminSignup({ email, password, fullName });
    setAuthToken(t, u);
    setToken(t);
    setUserState(u);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      const { user: u } = await authApi.me();
      setUserState(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      clearAuthToken();
      setToken(null);
      setUserState(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, adminSignup, signup, verifySignupOtp, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

const noop = () => {};
const noopAsync = async () => {};
const defaultAuth: AuthContextType = {
  user: null,
  token: null,
  loading: true,
  login: async () => {
    throw new Error("Auth provider not mounted");
  },
  adminLogin: noopAsync,
  adminSignup: noopAsync,
  signup: noopAsync,
  verifySignupOtp: noopAsync,
  logout: noop,
  setUser: noop,
  refreshUser: noopAsync,
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? defaultAuth;
}
