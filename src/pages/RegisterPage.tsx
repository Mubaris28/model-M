import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const RegisterPage = () => {
  const [form, setForm] = useState({ company: "", services: "", website: "", bio: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend
    console.log("Register professional:", form);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">É</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">ÉLITE</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto"
        >
          <h1 className="font-display text-5xl mb-2">Professional Registration</h1>
          <p className="text-muted-foreground text-sm font-body mb-8">Set up your professional profile</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Company Name</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="Your company" />
            </div>
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Services Offered</label>
              <input type="text" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="Photography, Casting, etc." />
            </div>
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="https://yoursite.com" />
            </div>
            <div>
              <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">About</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Tell us about your work..." />
            </div>
            <button type="submit" className="w-full bg-gradient-red text-primary-foreground py-3.5 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group">
              Complete Registration <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
