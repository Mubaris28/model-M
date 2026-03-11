"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactApi } from "@/lib/api";
import { reportSchema, REPORT_TYPES, type ReportInput } from "@/lib/validations/auth";

const ReportPage = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", reportType: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ReportInput) => {
    try {
      const body = {
        name: data.name,
        email: data.email,
        message: `[Report] Type: ${data.reportType}\nSubject: ${data.subject}\n\n${data.message}`,
      };
      await contactApi.send(body);
      setSuccess(true);
      reset();
    } catch (err) {
      setError("root", { message: "Failed to submit report. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Support</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">Report & Complaints</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h2 className="font-display text-2xl text-foreground mb-2">We take all reports seriously</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  Help us maintain a safe and professional platform by reporting any issues or concerns.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Report Misconduct</h3>
                    <p className="text-muted-foreground text-xs font-body">Report inappropriate behavior, harassment, or violations of our terms. We investigate all reports within 24–48 hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Safety Concerns</h3>
                    <p className="text-muted-foreground text-xs font-body">Report safety issues, suspicious activity, or security concerns. Your safety is our top priority.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg text-foreground mb-1">Technical Issues</h3>
                    <p className="text-muted-foreground text-xs font-body">Report bugs, technical problems, or platform issues. Help us improve the platform.</p>
                  </div>
                </div>
              </div>
              <div className="bg-card magazine-border p-4">
                <h4 className="font-display text-sm text-foreground mb-2 uppercase tracking-wider">Important Information</h4>
                <ul className="text-muted-foreground text-xs font-body space-y-1 list-disc list-inside">
                  <li>All reports are confidential and reviewed by our team</li>
                  <li>False reports may result in account suspension</li>
                  <li>For urgent safety concerns, contact us directly</li>
                  <li>We will follow up on your report within 48 hours</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Submit Report</h2>
              <p className="text-muted-foreground text-sm font-body mb-6">Please provide as much detail as possible to help us investigate your concern.</p>
              {errors.root && <p className="text-destructive font-body text-sm mb-6">{errors.root.message}</p>}
              {success ? (
                <div className="form-card">
                  <p className="text-primary font-body text-sm">Thank you! Your report has been submitted successfully. We will investigate and get back to you within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="form-card space-y-5" noValidate>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" {...register("name")} placeholder="Enter your full name" className="form-input" autoComplete="name" />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input type="email" {...register("email")} placeholder="Enter your email address" className="form-input" autoComplete="email" />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Report Type *</label>
                    <select {...register("reportType")} className="form-input">
                      <option value="">Select report type</option>
                      {REPORT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.reportType && <p className="form-error">{errors.reportType.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Subject *</label>
                    <input type="text" {...register("subject")} placeholder="Brief description of the issue" className="form-input" />
                    {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Detailed Description *</label>
                    <textarea
                      rows={5}
                      {...register("message")}
                      placeholder="Please provide detailed information about the issue, including dates, times, and any relevant details..."
                      className="form-input resize-none min-h-[120px]"
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary inline-flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "Submitting Report..." : "Submit Report"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReportPage;
