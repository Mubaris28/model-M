"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";
import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { contactApi } from "@/lib/api";

const PARTNER_TYPES = ["Brand Partnership", "Affiliate Partnership"];

export default function SponsorPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    interest: "",
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await contactApi.send({
        name: form.fullName,
        email: form.email,
        message: `[Partner Application]\nInterest: ${form.interest}\nPhone: ${form.phone}\nCompany: ${form.companyName}\nWebsite: ${form.website}\n\n${form.message}`,
      });
      setStatus("success");
      setForm({ interest: "", fullName: "", email: "", phone: "", companyName: "", website: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Partners</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent mb-16">Partner with Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl text-foreground mb-2">Partner with Us and Unlock New Opportunities</h2>
              <p className="text-muted-foreground font-body text-sm mb-8">Join Our Exclusive Brand Network — Partner with a platform that connects thousands of talents with opportunities in the modeling industry.</p>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-display text-xl text-foreground mb-2">Targeted Reach</h3>
                  <p className="text-muted-foreground font-body text-sm">Connect with models, agencies, photographers, and industry professionals. Thousands of active users monthly.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground mb-2">Brand Visibility</h3>
                  <p className="text-muted-foreground font-body text-sm">Showcase your brand to the right audience. High engagement rates in the industry.</p>
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground mb-2">Strategic Partnership</h3>
                  <p className="text-muted-foreground font-body text-sm">Build meaningful relationships with industry leaders. Exclusive networking opportunities.</p>
                </div>
              </div>

              <div className="bg-card magazine-border p-6">
                <h3 className="font-display text-lg text-foreground mb-2">Why Partner with Model Management?</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  Model Management Mauritius is the leading platform connecting talent with opportunities in the modeling industry. Our platform serves models, agencies, photographers, and brands across the region. Partner with us to gain visibility, build brand recognition, and contribute to the growth of the creative industry.
                </p>
              </div>
            </div>

            <div className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Become a Partner</h2>
              <p className="text-muted-foreground font-body text-sm mb-6">Fill out the form below and we&apos;ll create a custom package for you.</p>

              {status === "success" && (
                <p className="text-primary font-body text-sm mb-6 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Thank you! Your application has been submitted successfully. We&apos;ll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-destructive font-body text-sm mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Failed to submit application. Please try again.
                </p>
              )}

              {status !== "success" && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="form-label">I&apos;m Interested In *</label>
                    <select
                      required
                      value={form.interest}
                      onChange={(e) => setForm((p) => ({ ...p, interest: e.target.value }))}
                      className="form-input"
                    >
                      <option value="">Select</option>
                      {PARTNER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input type="text" required value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} placeholder="Enter your full name" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Enter your email address" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Enter your phone number" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Company Name</label>
                    <input type="text" value={form.companyName} onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} placeholder="Enter your company name" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Website</label>
                    <input type="url" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} placeholder="https://example.com" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Tell us about your partnership goals and what you're looking for..." className="form-input resize-none" />
                  </div>
                  <button type="submit" disabled={status === "submitting"} className="btn-primary inline-flex items-center gap-2">
                    {status === "submitting" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {status === "submitting" ? "Submitting Application..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
