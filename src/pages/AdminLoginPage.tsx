import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="w-full max-w-md magazine-border p-8 bg-card">
        <h1 className="font-display text-3xl text-primary mb-1">Admin Portal</h1>
        <p className="text-muted-foreground text-sm font-body mb-8">Please login with your administrator credentials</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary"
              required
            />
          </div>
          {error && <p className="text-primary text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login to Admin Panel"}
          </button>
        </form>
        <p className="text-center text-muted-foreground text-xs font-body mt-6">
          <a href="/" className="text-primary hover:underline">Back to site</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
