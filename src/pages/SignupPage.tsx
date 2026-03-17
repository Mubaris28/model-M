import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useIsDesktop } from "@/hooks/use-mobile";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, verifySignupOtp } = useAuth();
  const isDesktop = useIsDesktop();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

  // OTP step state
  const [step, setStep] = useState<"form" | "otp">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingFormData, setPendingFormData] = useState<SignupInput | null>(null);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setFormError("");
    try {
      await signup(data.email, data.password, data.name, data.phone || undefined);
      setPendingEmail(data.email);
      setPendingFormData(data);
      setStep("otp");
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const onVerify = async () => {
    setOtpError("");
    setIsVerifying(true);
    try {
      await verifySignupOtp(pendingEmail, otp);
      navigate("/select-role");
    } catch (err) {
      setOtpError((err as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };

  const onResend = async () => {
    if (!pendingFormData) return;
    setOtpError("");
    setIsResending(true);
    try {
      await signup(
        pendingFormData.email,
        pendingFormData.password,
        pendingFormData.name,
        pendingFormData.phone || undefined
      );
    } catch (err) {
      setOtpError((err as Error).message);
    } finally {
      setIsResending(false);
    }
  };

  const otpForm = (isMobile: boolean) => (
    <div className={isMobile ? "space-y-4" : "space-y-5"}>
      <div>
        <p className={`text-muted-foreground font-body ${isMobile ? "text-xs" : "text-sm"} mb-4`}>
          We sent a 6-digit verification code to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>
        </p>
        <label className="form-label">Verification code</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="form-input text-center text-2xl tracking-[0.5em]"
          placeholder="000000"
          autoFocus
          autoComplete="one-time-code"
        />
      </div>
      {otpError && (
        <div className="p-4 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-body">
          {otpError}
        </div>
      )}
      <button
        type="button"
        onClick={onVerify}
        disabled={otp.length < 6 || isVerifying}
        className="btn-primary w-full inline-flex items-center justify-center gap-2"
      >
        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
        {isVerifying ? "Verifying..." : "Verify email"}
      </button>
      <p className={`text-center font-body text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}>
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="text-primary hover:underline font-medium disabled:opacity-50"
        >
          {isResending ? "Sending..." : "Resend code"}
        </button>
      </p>
      <button
        type="button"
        onClick={() => { setStep("form"); setOtp(""); setOtpError(""); }}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs font-body"
      >
        <ArrowLeft className="w-3 h-3" /> Back to signup
      </button>
    </div>
  );

  const signupForm = (isMobile: boolean) => (
    <form onSubmit={handleSubmit(onSubmit)} className={isMobile ? "space-y-4" : "space-y-5"} noValidate>
      <div>
        <label className="form-label" {...(isMobile ? { htmlFor: "signup-name" } : {})}>Full name</label>
        <input
          {...(isMobile ? { id: "signup-name" } : {})}
          type="text"
          {...register("name")}
          className="form-input"
          placeholder="Enter your full name"
          autoComplete="name"
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>
      <div>
        <label className="form-label" {...(isMobile ? { htmlFor: "signup-email" } : {})}>Email</label>
        <input
          {...(isMobile ? { id: "signup-email" } : {})}
          type="email"
          {...register("email")}
          className="form-input"
          placeholder="your@email.com"
          autoComplete="email"
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>
      <div>
        <label className="form-label" {...(isMobile ? { htmlFor: "signup-phone" } : {})}>Phone (optional)</label>
        <input
          {...(isMobile ? { id: "signup-phone" } : {})}
          type="tel"
          {...register("phone")}
          className="form-input"
          placeholder="+230..."
          autoComplete="tel"
        />
        {errors.phone && <p className="form-error">{errors.phone.message}</p>}
      </div>
      <div className="relative">
        <label className="form-label" {...(isMobile ? { htmlFor: "signup-password" } : {})}>Password</label>
        <input
          {...(isMobile ? { id: "signup-password" } : {})}
          type={showPassword ? "text" : "password"}
          {...register("password")}
          className="form-input pr-12"
          placeholder="Min. 6 characters"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground ${!isMobile ? "touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" : ""}`}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>
      <div className="relative">
        <label className="form-label" {...(isMobile ? { htmlFor: "signup-confirm" } : {})}>Confirm password</label>
        <input
          {...(isMobile ? { id: "signup-confirm" } : {})}
          type={showConfirm ? "text" : "password"}
          {...register("confirmPassword")}
          className="form-input pr-12"
          placeholder="Repeat password"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground ${!isMobile ? "touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" : ""}`}
          aria-label={showConfirm ? "Hide password" : "Show password"}
        >
          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id={isMobile ? "agreeTerms" : "agreeTerms-desktop"}
          {...register("agreeTerms")}
          className="mt-1.5 h-4 w-4 rounded border-input accent-primary flex-shrink-0"
        />
        <label
          htmlFor={isMobile ? "agreeTerms" : "agreeTerms-desktop"}
          className="text-sm font-body text-muted-foreground cursor-pointer"
        >
          I agree to the{" "}
          <Link to="/footer/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link to="/footer/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
        </label>
      </div>
      {errors.agreeTerms && <p className="form-error">{errors.agreeTerms.message}</p>}
      {formError && (
        <div className="p-4 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-body">
          {formError}
        </div>
      )}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full inline-flex items-center justify-center gap-2">
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
        {isSubmitting ? "Sending code..." : "Create account"}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop: left panel with hero image (only when desktop so one form in DOM) */}
      {isDesktop && (
      <div className="lg:flex lg:w-1/2 relative overflow-hidden bg-foreground">
        <img src="/images/hero/hero-model.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 cinematic-overlay" />
        <Link to="/" className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-white/90 hover:text-white font-body text-sm tracking-wider uppercase transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="relative z-10 flex items-center justify-center p-12 text-center w-full">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src="/images/hero-logo/modelmanagement-logo.png" alt="Model Management" className="object-contain mx-auto" style={{ width: "240px", height: "75px" }} />
            </Link>
            <h1 className="font-display text-6xl text-white mb-4">JOIN US</h1>
            <p className="text-white/90 font-body text-sm max-w-sm mx-auto">
              Start your journey in the modeling industry. Connect with top agencies, photographers, and brands.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Mobile: only render when not desktop so there is exactly one form in the DOM */}
      {!isDesktop && (
      <div className="relative w-full min-h-[100dvh]">
        <img src="/images/hero/hero-model.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none" />
        <div className="absolute inset-0 cinematic-overlay pointer-events-none" />
        <div
          className="relative z-10 w-full min-h-[100dvh] py-6 px-4 pt-14 pb-8 overflow-y-auto overflow-x-hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-3">
              <img src="/images/hero-logo/modelmanagement-logo.png" alt="Model Management" className="object-contain mx-auto w-[140px] h-auto" />
            </Link>
            <h1 className="font-display text-3xl text-white mb-2">JOIN US</h1>
            <p className="text-white/90 font-body text-xs max-w-xs mx-auto">
              Start your journey in the modeling industry. Connect with top agencies, photographers, and brands.
            </p>
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="bg-background border border-border p-6 rounded-sm shadow-sm">
              {step === "form" ? (
                <>
                  <h2 className="font-display text-2xl mb-1 text-foreground">Create Account</h2>
                  <p className="text-muted-foreground text-xs font-body mb-5">Join thousands of models and professionals</p>
                  {signupForm(true)}
                  <p className="text-center text-muted-foreground text-xs font-body mt-5">
                    Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl mb-1 text-foreground">Check your email</h2>
                  {otpForm(true)}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Desktop: right panel form only (only when desktop) */}
      {isDesktop && (
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {step === "form" ? (
            <>
              <h2 className="font-display text-4xl mb-2">Create Account</h2>
              <p className="text-muted-foreground text-sm font-body mb-8">Join thousands of models and professionals</p>
              {signupForm(false)}
              <p className="text-center text-muted-foreground text-sm font-body mt-6">
                Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-4xl mb-2">Check your email</h2>
              {otpForm(false)}
            </>
          )}
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default SignupPage;
