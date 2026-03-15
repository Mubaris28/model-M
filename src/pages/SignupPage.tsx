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
  const { signup } = useAuth();
  const isDesktop = useIsDesktop();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState("");

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
      navigate("/select-role");
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

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
              <h2 className="font-display text-2xl mb-1 text-foreground">Create Account</h2>
              <p className="text-muted-foreground text-xs font-body mb-5">Join thousands of models and professionals</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="form-label" htmlFor="signup-name">Full name</label>
                  <input id="signup-name" type="text" {...register("name")} className="form-input" placeholder="Enter your full name" autoComplete="name" />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="signup-email">Email</label>
                  <input id="signup-email" type="email" {...register("email")} className="form-input" placeholder="your@email.com" autoComplete="email" />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="signup-phone">Phone (optional)</label>
                  <input id="signup-phone" type="tel" {...register("phone")} className="form-input" placeholder="+230..." autoComplete="tel" />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>
                <div className="relative">
                  <label className="form-label" htmlFor="signup-password">Password</label>
                  <input id="signup-password" type={showPassword ? "text" : "password"} {...register("password")} className="form-input pr-12" placeholder="Min. 6 characters" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  {errors.password && <p className="form-error">{errors.password.message}</p>}
                </div>
                <div className="relative">
                  <label className="form-label" htmlFor="signup-confirm">Confirm password</label>
                  <input id="signup-confirm" type={showConfirm ? "text" : "password"} {...register("confirmPassword")} className="form-input pr-12" placeholder="Repeat password" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground" aria-label={showConfirm ? "Hide password" : "Show password"}>{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="agreeTerms" {...register("agreeTerms")} className="mt-1.5 h-4 w-4 rounded border-input accent-primary flex-shrink-0" />
                  <label htmlFor="agreeTerms" className="text-sm font-body text-muted-foreground cursor-pointer">I agree to the <Link to="/footer/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/footer/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></label>
                </div>
                {errors.agreeTerms && <p className="form-error">{errors.agreeTerms.message}</p>}
                {formError && <div className="p-4 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-body">{formError}</div>}
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>
              <p className="text-center text-muted-foreground text-xs font-body mt-5">
                Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
              </p>
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
          <h2 className="font-display text-4xl mb-2">Create Account</h2>
          <p className="text-muted-foreground text-sm font-body mb-8">Join thousands of models and professionals</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="form-label">Full name</label>
              <input type="text" {...register("name")} className="form-input" placeholder="Enter your full name" autoComplete="name" />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" {...register("email")} className="form-input" placeholder="your@email.com" autoComplete="email" />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Phone (optional)</label>
              <input type="tel" {...register("phone")} className="form-input" placeholder="+230..." autoComplete="tel" />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>
            <div className="relative">
              <label className="form-label">Password</label>
              <input type={showPassword ? "text" : "password"} {...register("password")} className="form-input pr-12" placeholder="Min. 6 characters" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
            <div className="relative">
              <label className="form-label">Confirm password</label>
              <input type={showConfirm ? "text" : "password"} {...register("confirmPassword")} className="form-input pr-12" placeholder="Repeat password" autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" aria-label={showConfirm ? "Hide password" : "Show password"}>{showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreeTerms-desktop" {...register("agreeTerms")} className="mt-1.5 h-4 w-4 rounded border-input accent-primary" />
              <label htmlFor="agreeTerms-desktop" className="text-sm font-body text-muted-foreground cursor-pointer">I agree to the <Link to="/footer/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/footer/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link></label>
            </div>
            {errors.agreeTerms && <p className="form-error">{errors.agreeTerms.message}</p>}
            {formError && <div className="p-4 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-body">{formError}</div>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full inline-flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-center text-muted-foreground text-sm font-body mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
          </p>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default SignupPage;
