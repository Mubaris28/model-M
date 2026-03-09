import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FileEdit, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const ReviseApplicationPage = () => {
  const { user, logout, refreshUser } = useAuth();
  const isModel = (user?.role || "").toLowerCase() === "model";
  const reason = user?.rejectionReason?.trim();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <FileEdit className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-5xl mb-4">Changes Requested</h1>
        <p className="text-muted-foreground text-sm font-body mb-4">
          Our team has reviewed your application and requested some changes. Please update your application and resubmit.
        </p>
        {reason && (
          <div className="mb-6 p-4 border border-border bg-secondary text-left">
            <p className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-2">What to change</p>
            <p className="text-sm font-body text-foreground">{reason}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={isModel ? "/become-model?mode=revision" : "/register"}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity"
          >
            Go to application <ArrowRight className="w-4 h-4" />
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

export default ReviseApplicationPage;
