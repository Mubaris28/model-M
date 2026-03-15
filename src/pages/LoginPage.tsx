import { useState } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useIsDesktop } from "@/hooks/use-mobile";
import { ApiError } from "@/lib/api";
import { getRedirectPath } from "@/lib/authFlow";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isDesktop = useIsDesktop();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setFormError("");
    try {
      const user = await login(data.email, data.password);
      navigate(getRedirectPath(user));
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.code === "PASSWORD_RESET_REQUIRED") {
        const qs = new URLSearchParams({
          email: data.email,
          forced: "1",
        });
        navigate(`/forgot-password?${qs.toString()}`);
        return;
      }
      setFormError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Desktop: left panel (only when desktop so one form in DOM) */}
      {isDesktop && (
      <div className="lg:flex lg:w-1/2 relative overflow-hidden bg-foreground">
        <img src="/images/hero/hero-model.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="relative z-10 flex items-center justify-center p-12 text-center w-full">
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src="/images/hero-logo/modelmanagement-logo.png" alt="Model Management" className="object-contain mx-auto" style={{ width: "240px", height: "75px" }} />
            </Link>
            <h1 className="font-display text-6xl text-white mb-4">WELCOME BACK</h1>
            <p className="text-white/90 font-body text-sm max-w-sm mx-auto">
              Log in to access your dashboard, manage your portfolio, and discover new opportunities.
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Mobile: only when not desktop so exactly one form in the DOM */}
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
            <h1 className="font-display text-3xl text-white mb-2">WELCOME BACK</h1>
            <p className="text-white/90 font-body text-xs max-w-xs mx-auto">
              Log in to access your dashboard, manage your portfolio, and discover new opportunities.
            </p>
          </div>
          <div className="w-full max-w-md mx-auto">
            <div className="bg-background border border-border p-6 rounded-sm shadow-sm">
              <h2 className="font-display text-2xl mb-1 text-foreground">Log In</h2>
              <p className="text-muted-foreground text-xs font-body mb-5">Access your account</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label className="form-label" htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    {...register("email")}
                    className="form-input"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div className="relative">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="form-input pr-12"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {errors.password && <p className="form-error">{errors.password.message}</p>}
                </div>
                {formError && <p className="form-error">{formError}</p>}
                <div className="text-right">
                  <Link to="/forgot-password" className="text-primary text-sm font-body hover:underline">Forgot password?</Link>
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
                  {isSubmitting ? "Signing in..." : "Log in"}
                </button>
              </form>
              <p className="text-center text-muted-foreground text-xs font-body mt-5">
                Don&apos;t have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
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
          <h2 className="font-display text-4xl mb-2">Log In</h2>
          <p className="text-muted-foreground text-sm font-body mb-8">Access your account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                {...register("email")}
                className="form-input"
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="form-input pr-12"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <div className="text-right">
              <Link to="/forgot-password" className="text-primary text-sm font-body hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full inline-flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <ArrowRight className="w-4 h-4" />}
              {isSubmitting ? "Signing in..." : "Log in"}
            </button>
          </form>
          <p className="text-center text-muted-foreground text-sm font-body mt-6">
            Don&apos;t have an account? <Link to="/signup" className="text-primary hover:underline font-medium">Sign Up</Link>
          </p>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default LoginPage;
