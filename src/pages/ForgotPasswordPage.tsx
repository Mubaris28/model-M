import { useEffect, useState } from "react";
import { Link } from "@/lib/router-next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [forcedReset, setForcedReset] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qEmail = (params.get("email") || "").trim();
    const forced = params.get("forced") === "1";
    if (qEmail) setEmail(qEmail);
    setForcedReset(forced);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setFormError("");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: normalizedEmail });
      setSent(true);
    } catch (err) {
      setFormError((err as Error).message || "Failed to send reset link. Please try again.");
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
          <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">É</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">ÉLITE</span>
        </Link>

        <h2 className="font-display text-4xl mb-2">Reset Password</h2>
        <p className="text-muted-foreground text-sm font-body mb-8">
          {sent ? "Check your email for reset instructions." : "Enter your email address and we'll send you a reset link."}
        </p>

        {forcedReset && !sent && (
          <p className="mb-4 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2 text-xs font-body text-foreground">
            Your account requires a password reset before you can sign in.
          </p>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="form-card text-center">
            <p className="text-foreground font-body text-sm mb-4">A password reset link has been sent to <strong>{email}</strong></p>
            <p className="text-muted-foreground text-xs font-body mb-4">Open the link in your email to continue on the reset-password page.</p>
            <button onClick={() => setSent(false)} className="text-primary text-xs font-body hover:underline">Resend Email</button>
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

export default ForgotPasswordPage;
