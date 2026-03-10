import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    // Phone optional for signup
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.agreeTerms) errs.agreeTerms = "You must agree to the terms";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name, form.phone);
      // Always send new signups to select-role (never to admin). Admin panel is for login only.
      navigate("/select-role");
    } catch (err) {
      setErrors({ form: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-red items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <Link to="/" className="inline-block mb-8">
            <div className="w-16 h-16 bg-background flex items-center justify-center mx-auto mb-4">
              <span className="font-display text-primary text-4xl leading-none">É</span>
            </div>
          </Link>
          <h1 className="font-display text-6xl text-white mb-4">JOIN ÉLITE</h1>
          <p className="text-white/70 font-body text-sm max-w-sm mx-auto">
            Start your journey in the modeling industry. Connect with top agencies, photographers, and brands.
          </p>
        </div>
      </div>

      {/* Right side - form */}
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

          <h2 className="font-display text-4xl mb-2">Create Account</h2>
          <p className="text-muted-foreground text-sm font-body mb-8">Join thousands of models and professionals</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="form-input"
                placeholder="your@email.com"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div>
              <label className="form-label">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="form-input"
                placeholder="+230..."
              />
              {errors.phone && <p className="form-error">{errors.phone}</p>}
            </div>
            <div className="relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="form-input pr-12"
                placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>
            <div className="relative">
              <label className="form-label">Confirm password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="form-input pr-12"
                placeholder="Repeat password"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground" aria-label={showConfirm ? "Hide password" : "Show password"}>
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={form.agreeTerms}
                onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                className="mt-1.5 h-4 w-4 rounded border-input accent-primary"
              />
              <label htmlFor="agreeTerms" className="text-sm font-body text-muted-foreground cursor-pointer">
                I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="form-error">{errors.agreeTerms}</p>}
            {errors.form && (
              <div className="p-4 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-body">
                {errors.form}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating..." : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-muted-foreground text-sm font-body mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
