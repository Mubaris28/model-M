import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";

const MIN_PASSWORD_LENGTH = 6;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qToken = (params.get("token") || "").trim();
    setToken(qToken);
  }, []);

  const validate = () => {
    if (!token) {
      setFormError("Reset token is missing. Please use the reset link from your email.");
      return false;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return false;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setFormError((err as Error).message || "Unable to reset password. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">M</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">Model Management</span>
        </Link>

        <h2 className="font-display text-4xl mb-2">Set New Password</h2>
        <p className="text-muted-foreground text-sm font-body mb-8">
          {success
            ? "Your password has been updated. You can now sign in."
            : "Enter your new password to complete the reset."}
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="relative">
              <label className="form-label">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pr-12"
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <label className="form-label">Confirm New Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input pr-12"
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        ) : (
          <div className="form-card text-center">
            <p className="text-foreground font-body text-sm mb-4">Password reset complete.</p>
            <button onClick={() => navigate("/login", { replace: true })} className="btn-primary w-full inline-flex items-center justify-center gap-2">
              Go to login <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-primary transition-colors mt-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
