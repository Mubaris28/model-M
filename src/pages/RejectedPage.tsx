import { useState, useEffect } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { XCircle, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";

const RejectedPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [reapplyLoading, setReapplyLoading] = useState(false);
  const reason = user?.rejectionReason?.trim();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleReapply = async () => {
    if (reapplyLoading) return;
    setReapplyLoading(true);
    try {
      await authApi.updateProfile({ status: "pending" });
      await refreshUser();
      const isModel = (user?.role || "").toLowerCase() === "model";
      navigate(isModel ? "/become-model" : "/register");
    } catch {
      setReapplyLoading(false);
    } finally {
      setReapplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-5xl mb-4">Application Rejected</h1>
        <p className="text-muted-foreground text-sm font-body mb-4">
          Unfortunately, your application was not approved at this time.
        </p>
        {reason && (
          <div className="mb-6 p-4 border border-border bg-secondary text-left">
            <p className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-2">Reason from our team</p>
            <p className="text-sm font-body text-foreground">{reason}</p>
          </div>
        )}
        <p className="text-muted-foreground text-sm font-body mb-8">
          You can reapply after updating your application, or contact support for more details.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleReapply}
            disabled={reapplyLoading}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            <RotateCcw className="w-4 h-4" /> {reapplyLoading ? "Loading..." : "Reapply"}
          </button>
          <Link to="/contact" className="inline-flex border border-border text-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all">
            Contact Support
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex border border-border text-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all"
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectedPage;
