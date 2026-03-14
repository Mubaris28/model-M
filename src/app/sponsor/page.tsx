"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle, Target, TrendingUp, Users, Handshake } from "lucide-react";
import { contactApi } from "@/lib/api";
import { motion } from "framer-motion";

const PARTNER_TYPES = ["Brand Partnership", "Affiliate Partnership"];

const benefits = [
  {
    icon: Target,
    title: "Targeted Reach",
    text: "Connect directly with models, agencies, photographers, and industry professionals — your exact audience.",
  },
  {
    icon: TrendingUp,
    title: "Brand Visibility",
    text: "High engagement rates in the modeling industry. Showcase your brand where it matters most.",
  },
  {
    icon: Users,
    title: "Active Community",
    text: "Thousands of active users monthly, from aspiring models to established industry professionals.",
  },
  {
    icon: Handshake,
    title: "Strategic Partnership",
    text: "Build meaningful relationships with industry leaders and exclusive networking opportunities.",
  },
];

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

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Partnerships</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Partner With Us</h1>
          <p className="text-muted-foreground font-body text-sm mt-4 max-w-lg">
            Join our exclusive brand network and unlock new opportunities in the modeling industry.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Why Partner</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">What You Get</h2>
          </div>
          <div className="mobile-slider gap-5 mb-16">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card magazine-border p-6"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Why us statement */}
          <div className="relative overflow-hidden bg-foreground p-8 md:p-12 mb-16">
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=60"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="font-display text-3xl md:text-4xl text-background mb-4">
                Why Partner with Model Management?
              </h3>
              <p className="text-background/70 font-body text-sm leading-relaxed">
                Model Management Mauritius is the leading platform connecting talent with opportunities in the modeling
                industry. Our platform serves models, agencies, photographers, and brands across the region. Partner
                with us to gain visibility, build brand recognition, and contribute to the growth of the creative industry.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Apply Now</p>
              <h2 className="font-display text-4xl text-foreground mb-4">Become a Partner</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
                Fill out the form and we&apos;ll create a custom package tailored to your goals. Our team will get back to you within 24 hours.
              </p>
              <div className="bg-card magazine-border p-5">
                <p className="font-display text-lg text-foreground mb-1">Flash Communications Ltd</p>
                <p className="text-muted-foreground text-xs font-body leading-relaxed">
                  2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius, 72201
                </p>
                <p className="text-muted-foreground text-xs font-body mt-2">www.theflashgroups.com</p>
              </div>
            </div>

            <div className="lg:col-span-8 bg-card magazine-border p-8">
              {status === "success" && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-display text-3xl text-foreground mb-2">Application Submitted!</h3>
                  <p className="text-muted-foreground font-body text-sm">
                    Thank you! We&apos;ll create a custom package and get back to you soon.
                  </p>
                </div>
              )}
              {status === "error" && (
                <p className="text-destructive font-body text-sm mb-6 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Failed to submit. Please try again.
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
                      <option value="">Select partnership type</option>
                      {PARTNER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="Your full name"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+230 ..."
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="form-label">Company Name</label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                        placeholder="Your company"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://example.com"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us about your partnership goals..."
                      className="form-input resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {status === "submitting" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Submit Application</>
                    )}
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
