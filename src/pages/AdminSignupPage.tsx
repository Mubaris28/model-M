import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { useAuth } from "@/contexts/AuthContext";

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { adminSignup } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await adminSignup(form.email, form.password, form.fullName);
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
        <h1 className="font-display text-3xl text-primary mb-1">Create Admin Account</h1>
        <p className="text-muted-foreground text-sm font-body mb-8">
          Sign up with an authorized admin email (e.g. mubarismuhammed33@gmail.com). After this you can log in at the admin panel.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Full name (optional)</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="form-input"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-input"
              placeholder="mubarismuhammed33@gmail.com"
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create admin account"}
          </button>
        </form>
        <p className="text-center text-muted-foreground text-xs font-body mt-6">
          Already have an admin account? <Link to="/admin/login" className="text-primary hover:underline">Log in</Link>
        </p>
        <p className="text-center text-muted-foreground text-xs font-body mt-2">
          <a href="/" className="text-primary hover:underline">Back to site</a>
        </p>
      </div>
    </div>
  );
};

export default AdminSignupPage;
