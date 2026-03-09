import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { motion } from "framer-motion";

const BecomeModelPage = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

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
          className="max-w-2xl mx-auto"
        >
          <h1 className="font-display text-5xl mb-2">Model Application</h1>
          <p className="text-muted-foreground text-sm font-body mb-8">Complete your profile to get discovered</p>

          {/* Progress */}
          <div className="flex gap-2 mb-10">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 transition-all ${i < step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Date of Birth</label>
                  <input type="date" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Gender</label>
                  <select className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors">
                    <option value="">Select</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Country</label>
                  <input type="text" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="e.g. France" />
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">City</label>
                  <input type="text" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Paris" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl mb-4">Physical Attributes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Height (cm)</label>
                  <input type="number" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="175" />
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input type="number" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="60" />
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Eye Color</label>
                  <input type="text" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="Brown" />
                </div>
                <div>
                  <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Hair Color</label>
                  <input type="text" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="Black" />
                </div>
              </div>
              <div>
                <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {["Bold", "Bikini", "Artistic Nude", "Glamour", "Commercial", "Fitness", "Editorial"].map((cat) => (
                    <button key={cat} className="px-4 py-2 text-xs font-body tracking-[0.1em] uppercase border border-border hover:border-primary hover:text-primary transition-colors">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-2xl mb-4">Portfolio & Social</h3>
              <div>
                <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-2 block">Upload Photos</label>
                <div className="border-2 border-dashed border-border p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-body">Click or drag photos here</p>
                  <p className="text-muted-foreground text-[10px] font-body mt-1">Min 3 photos • JPG, PNG</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Instagram</label>
                <input type="text" className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors" placeholder="@username" />
              </div>
              <div>
                <label className="text-xs font-body tracking-[0.15em] uppercase text-muted-foreground mb-1 block">Bio</label>
                <textarea className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Tell us about yourself..." />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-foreground transition-colors ${step === 1 ? "invisible" : ""}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity flex items-center gap-2 group"
              >
                Next <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                className="bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity flex items-center gap-2 group"
              >
                Submit Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeModelPage;
