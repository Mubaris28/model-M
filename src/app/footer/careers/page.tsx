"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactApi } from "@/lib/api";
import { Loader2, Send } from "lucide-react";

const POSITIONS = ["Model Lead", "Model Manager", "Other (Please specify in cover letter)"] as const;

const careersSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Please select a position"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  coverLetter: z.string().max(1000).optional(),
});

type CareersInput = z.infer<typeof careersSchema>;

export default function CareersPage() {
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CareersInput>({
    resolver: zodResolver(careersSchema),
    defaultValues: { fullName: "", position: "", email: "", phone: "", coverLetter: "" },
  });

  const onSubmit = async (data: CareersInput) => {
    setSubmitError(null);
    try {
      await contactApi.send({
        name: data.fullName,
        email: data.email,
        message: `[Careers Application]\nPosition: ${data.position}\nPhone: ${data.phone}\n\nCover Letter:\n${data.coverLetter || "(none)"}`,
      });
      setSuccess(true);
    } catch {
      setSubmitError("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Join Our Team</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">An inclusive, supportive, and welcoming environment where you can genuinely grow and thrive.</p>

          <div className="mt-12 space-y-12">
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Careers at Model Management</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                Our talented, friendly team operates as one, breaking down departmental barriers to offer everyone the chance to learn about all aspects of the business and our clients. We are pioneers, innovators, and creators, committed to celebrating diversity, encouraging knowledge sharing, and nurturing development to shape the future of media and Model Management all together.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card magazine-border p-8">
                <h3 className="font-display text-xl text-foreground mb-2">Model Lead (Full-Time)</h3>
                <p className="text-muted-foreground text-xs font-body leading-relaxed mb-4">
                  Are you passionate about the fashion and entertainment industry? We are seeking a dedicated and dynamic Model Lead to join our team. Key responsibilities: Talent Management, Bookings and Scheduling, Contract Negotiation, Client Relations, Business Development.
                </p>
                <p className="text-muted-foreground text-[10px] font-body">Skills: Industry Knowledge, Business Acumen, Talent Management, Networking, Organizational Skills.</p>
              </div>
              <div className="bg-card magazine-border p-8">
                <h3 className="font-display text-xl text-foreground mb-2">Model Manager (Full-Time)</h3>
                <p className="text-muted-foreground text-xs font-body leading-relaxed mb-4">
                  We&apos;re looking for a dynamic and dedicated Model Manager. Key responsibilities: Talent Scouting and Development, Client and Agency Relations, Booking and Scheduling, Administrative Duties, Career Building, Event Attendance.
                </p>
                <p className="text-muted-foreground text-[10px] font-body">Traits: Resilience, Organizational Skills, Communication, Dedication, Business Acumen, Flexibility.</p>
              </div>
            </section>

            <section className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Ready to Make a Difference? Apply Today!</h2>
              <p className="text-muted-foreground font-body text-sm mb-8">Join our dynamic team and start your journey with Model Management</p>
              {success ? (
                <p className="text-primary font-body text-sm">Thank you! Your application has been submitted successfully. We&apos;ll review it and get back to you soon. You may send your resume/CV to info@modelmanagement.mu with the subject &quot;Career Application&quot;.</p>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {submitError && <p className="text-destructive text-sm font-body">{submitError}</p>}
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input {...register("fullName")} placeholder="Enter your full name" className="form-input" />
                    {errors.fullName && <p className="form-error">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Position Applying For *</label>
                    <select {...register("position")} className="form-input">
                      <option value="">Choose your desired position</option>
                      {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.position && <p className="form-error">{errors.position.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Your Email *</label>
                    <input type="email" {...register("email")} placeholder="Enter your email address" className="form-input" />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" {...register("phone")} placeholder="Enter your phone number" className="form-input" />
                    {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Cover Letter (max 1000 characters)</label>
                    <textarea {...register("coverLetter")} rows={5} placeholder="Tell us why you're interested in joining our team..." className="form-input resize-none" maxLength={1000} />
                  </div>
                  <p className="text-muted-foreground text-xs">Upload Resume / CV: After submitting, you can send your documents to info@modelmanagement.mu with subject &quot;Career Application&quot;. Max 20 MB, PDF/doc/docx/txt.</p>
                  <button type="submit" disabled={isSubmitting} className="btn-primary inline-flex items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
