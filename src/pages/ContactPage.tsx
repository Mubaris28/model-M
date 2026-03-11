import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
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
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Get in Touch</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">Contact</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h2 className="font-display text-2xl text-foreground mb-2">Get in Touch</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </div>
              {[
                { icon: Mail, label: "Email Us", value: "info@modelmanagement.mu", sub: "We'll respond within 24 hours" },
                { icon: Phone, label: "Call Us", value: "+230 468 6969", sub: "Mon-Fri from 8am to 6pm" },
                { icon: MapPin, label: "Visit Us", value: "2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene", sub: "Mauritius, 72201" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-red flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase mb-1">{item.label}</p>
                    <p className="text-foreground text-sm font-body">{item.value}</p>
                    {item.sub && <p className="text-muted-foreground text-xs font-body mt-0.5">{item.sub}</p>}
                  </div>
                </div>
              ))}

              <div className="bg-card magazine-border p-6 mt-8">
                <h3 className="font-display text-xl text-foreground mb-2">Flash Communications Ltd</h3>
                <p className="text-muted-foreground text-xs font-body leading-relaxed">
                  2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius, 72201. Website: www.theflashgroups.com
                </p>
                <p className="text-muted-foreground text-xs font-body mt-2">Follow Us: Stay updated with our latest news and updates — Instagram, TikTok, LinkedIn, Facebook</p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <h2 className="font-display text-2xl text-foreground mb-2">Send Message</h2>
              <p className="text-muted-foreground text-sm font-body mb-6">Fill out the form below and we&apos;ll get back to you</p>
              {errors.root && <p className="text-destructive font-body text-sm mb-6">{errors.root.message}</p>}
              {success ? (
                <p className="text-primary font-body text-sm mb-6">Thank you! Your message has been sent.</p>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="form-card space-y-5" noValidate>
                  <div>
                    <label className="form-label">Full name</label>
                    <input
                      type="text"
                      {...register("name")}
                      placeholder="Enter your full name"
                      className="form-input"
                      autoComplete="name"
                    />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Email address</label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email address"
                      className="form-input"
                      autoComplete="email"
                    />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea
                      rows={5}
                      {...register("message")}
                      placeholder="Tell us how we can help you..."
                      className="form-input resize-none min-h-[120px]"
                    />
                    {errors.message && <p className="form-error">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary inline-flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "Sending..." : "Send message"}
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
