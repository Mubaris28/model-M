import { Clock, CheckCircle, FileCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "@/lib/router-next";
import FlowStepper from "@/components/FlowStepper";

const steps = [
  { label: "Application Review", icon: FileCheck },
  { label: "Verification Process", icon: Loader2 },
  { label: "Account Activation", icon: CheckCircle },
];

const VerificationPendingPage = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <FlowStepper currentStep={4} className="mb-6" />
        <div className="w-20 h-20 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-5xl mb-2">Account Under Review</h1>
        <p className="text-muted-foreground text-sm font-body mb-10">
          We're reviewing your application. You'll be notified once your account is activated.
        </p>

        <div className="text-left mb-10">
          <h2 className="font-display text-xl mb-4">Review progress</h2>
          <ul className="space-y-4">
            {steps.map((s, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-body text-sm text-foreground">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-muted-foreground text-sm font-body mb-8">We'll be in touch.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex bg-primary text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity"
          >
            Sign out
          </button>
          <Link to="/contact" className="inline-flex border border-border text-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all">
            Contact us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationPendingPage;
