import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Mail, Phone, MapPin, Send, Loader2, Instagram, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactApi } from "@/lib/api";
import { contactSchema, type ContactInput } from "@/lib/validations/auth";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await contactApi.send(data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError("root", { message: (err as Error).message });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Get in Touch</p>
            <h1 className="font-display text-7xl md:text-9xl leading-none">Contact</h1>
          </motion.div>
        </div>
      </div>

      <div className="pb-16 md:pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16"
          >
            {/* Info sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h2 className="font-display text-3xl text-foreground mb-2">We&apos;d love to hear from you</h2>
                <p className="text-muted-foreground text-base font-body leading-relaxed">
                  Send us a message and we&apos;ll respond as soon as possible — usually within 24 hours.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: Mail,
                    label: "Email Us",
                    value: "info@modelmanagement.mu",
                    sub: "We respond within 24 hours",
                    href: "mailto:info@modelmanagement.mu",
                  },
                  {
                    icon: Phone,
                    label: "WhatsApp",
                    value: "+230 5256 6333",
                    sub: "Chat with us",
                    href: "https://wa.me/23052566333",
                  },
                  {
                    icon: Phone,
                    label: "Office",
                    value: "+230 468 6969",
                    sub: "Mon–Fri, 8am – 6pm",
                    href: "tel:+2304686969",
                  },
                  {
                    icon: MapPin,
                    label: "Visit Us",
                    value: "2nd Floor, Unity House",
                    sub: "Rue Du Savoir, Cybercity, Ebene, Mauritius 72201",
                    href: undefined,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-11 h-11 bg-primary flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-body tracking-[0.2em] uppercase mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground text-base font-body hover:text-primary transition-colors"
                          {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground text-base font-body">{item.value}</p>
                      )}
                      {item.sub && <p className="text-muted-foreground text-sm font-body mt-0.5">{item.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground font-body tracking-[0.3em] uppercase mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/modelmanagement.mu" },
                    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/people/ModelManagementmu/61583295135727/" },
                    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/modelmanagementmu" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <s.icon className="w-4 h-4" />
                    </a>
                  ))}
                  <a
                    href="https://www.tiktok.com/@modelmanagement.mu"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                </div>
              </div>

              <div className="bg-card magazine-border p-5">
                <h3 className="font-display text-lg text-foreground mb-1">Flash Communications Ltd</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius, 72201
                </p>
                <p className="text-muted-foreground text-sm font-body mt-1.5">
                  <a href="https://www.theflashgroups.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-base">
                    www.theflashgroups.com
                  </a>
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-8">
              <h2 className="font-display text-3xl text-foreground mb-1">Send a Message</h2>
              <p className="text-muted-foreground text-base font-body mb-8">Fill out the form below and we&apos;ll get back to you.</p>

              {errors.root && (
                <p className="text-destructive font-body text-sm mb-6 bg-destructive/10 px-4 py-3">
                  {errors.root.message}
                </p>
              )}

              {success ? (
                <div className="bg-primary/5 border border-primary/20 p-8 text-center">
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground font-body text-base">Thank you! We&apos;ll respond within 24 hours.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 text-primary font-body text-xs tracking-wider uppercase hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Full name *</label>
                      <input
                        type="text"
                        {...register("name")}
                        placeholder="Your full name"
                        className="form-input"
                        autoComplete="name"
                      />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Email address *</label>
                      <input
                        type="email"
                        {...register("email")}
                        placeholder="your@email.com"
                        className="form-input"
                        autoComplete="email"
                      />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Message *</label>
                    <textarea
                      rows={6}
                      {...register("message")}
                      placeholder="How can we help you? Tell us about your project, inquiry, or anything you'd like to discuss..."
                      className="form-input resize-none"
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-10"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
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

export default ContactPage;
