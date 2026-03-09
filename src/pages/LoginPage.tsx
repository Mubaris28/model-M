import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password.trim()) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-red items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-8">
            <div className="w-16 h-16 bg-background flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-primary text-4xl leading-none">É</span>
            </div>
          </Link>
          <h1 className="font-display text-6xl text-white mb-4">WELCOME BACK</h1>
          <p className="text-white/70 font-body text-sm max-w-sm mx-auto">
            Log in to access your dashboard, manage your portfolio, and discover new opportunities.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
                <span className="font-display text-primary-foreground text-lg leading-none">É</span>
              </div>
              <span className="font-display text-xl tracking-[0.15em] text-foreground">ÉLITE</span>
            </Link>
          </div>

          <h2 className="font-display text-4xl mb-2">Log In</h2>
          <p className="text-muted-foreground text-sm font-body mb-8">Access your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-primary text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors pr-12"
                placeholder="Enter password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <p className="text-primary text-xs mt-1">{errors.password}</p>}
            </div>
            {errors.form && <p className="text-primary text-xs">{errors.form}</p>}

            <div className="text-right">
              <Link to="/forgot-password" className="text-primary text-xs font-body hover:underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-red text-primary-foreground py-3.5 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? "Loading..." : "Log In"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm font-body mt-6">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
