import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";

const RejectedPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-5xl mb-4">Application Rejected</h1>
        <p className="text-muted-foreground text-sm font-body mb-8">
          Unfortunately, your application was not approved at this time. Please contact our support team for more details.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact" className="inline-flex bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity">
            Contact Support
          </Link>
          <Link to="/" className="inline-flex border border-border text-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all">
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectedPage;
