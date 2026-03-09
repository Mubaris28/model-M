import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Connect to backend
      setSent(true);
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

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-red text-primary-foreground py-3.5 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
            >
              Send Reset Link
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          <div className="bg-primary/10 border border-primary/20 p-6 text-center">
            <p className="text-foreground font-body text-sm mb-4">A password reset link has been sent to <strong>{email}</strong></p>
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
