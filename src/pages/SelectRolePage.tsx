import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { Camera, Briefcase, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import FlowStepper from "@/components/FlowStepper";

type Role = "model" | "professional" | null;

const SelectRolePage = () => {
  const [step, setStep] = useState<"choose" | "confirm">("choose");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSelect = (role: "model" | "professional") => {
    setSelectedRole(role);
    setStep("confirm");
    setError(null);
  };

  const handleGoBack = () => {
    setStep("choose");
    setSelectedRole(null);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!selectedRole || loading) return;
    setLoading(true);
    setError(null);
    try {
      await authApi.updateProfile({ role: selectedRole });
      await refreshUser();
      navigate(selectedRole === "model" ? "/become-model" : "/register");
    } catch (err) {
      setError((err as Error).message);
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
        className="w-full max-w-2xl"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <span className="font-display text-primary-foreground text-2xl leading-none">M</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">Model Management</span>
        </Link>

        <FlowStepper currentStep={2} className="mb-8" />
        <h2 className="font-display text-4xl md:text-5xl mb-2 text-center">Choose Your Path</h2>
        <p className="text-muted-foreground text-sm font-body mb-10 text-center">Select your account type to continue with your registration</p>

        <AnimatePresence mode="wait">
          {step === "choose" ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <button
                type="button"
                onClick={() => handleSelect("model")}
                className="group magazine-border p-8 hover:border-primary/50 transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Camera className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">I'm a Model</h3>
                <p className="text-muted-foreground text-sm font-body mb-4">Create your portfolio, apply for castings, and showcase your talent</p>
                <ul className="space-y-2 text-muted-foreground text-xs font-body">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Create stunning portfolio</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Apply for casting calls</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Connect with agencies</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Manage bookings</li>
                </ul>
                <span className="inline-flex items-center gap-2 text-primary text-xs font-body tracking-[0.15em] uppercase mt-4">
                  Select <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelect("professional")}
                className="group magazine-border p-8 hover:border-primary/50 transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <Briefcase className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">I'm a Professional</h3>
                <p className="text-muted-foreground text-sm font-body mb-4">Post castings, discover talent, and manage your creative projects</p>
                <ul className="space-y-2 text-muted-foreground text-xs font-body">
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Post casting calls</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Browse model profiles</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Manage applications</li>
                  <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Build your network</li>
                </ul>
                <span className="inline-flex items-center gap-2 text-primary text-xs font-body tracking-[0.15em] uppercase mt-4">
                  Select <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="magazine-border p-8 md:p-10 text-center"
            >
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Check className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-2">Confirm Your Choice</h3>
              <p className="text-muted-foreground text-sm font-body mb-2">You selected:</p>
              <p className="font-display text-3xl text-primary mb-4">
                {selectedRole === "model" ? "Model" : "Professional"}
              </p>
              {error && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/30 text-primary text-sm font-body">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                >
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
                  {loading ? "Setting up..." : "Confirm & Continue"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SelectRolePage;
