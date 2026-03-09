import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const VerificationPendingPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-5xl mb-4">Under Review</h1>
        <p className="text-muted-foreground text-sm font-body mb-8">
          Your application is being reviewed by our team. You'll receive an email notification once your profile is approved.
        </p>
        <Link to="/" className="inline-flex bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default VerificationPendingPage;
