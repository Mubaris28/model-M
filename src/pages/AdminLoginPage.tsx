import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md form-card">
        <h1 className="font-display text-3xl text-primary mb-1">Admin Portal</h1>
        <p className="text-muted-foreground text-sm font-body mb-8">Please login with your administrator credentials</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
            {loading ? "Signing in..." : "Login to Admin Panel"}
          </button>
        </form>
        <p className="text-center text-muted-foreground text-xs font-body mt-6">
          Don't have an admin account? <Link to="/admin/signup" className="text-primary hover:underline">Create admin account</Link>
        </p>
        <p className="text-center text-muted-foreground text-xs font-body mt-2">
          <a href="/" className="text-primary hover:underline">Back to site</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
