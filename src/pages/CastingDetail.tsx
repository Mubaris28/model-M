"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { castings as fallbackCastings } from "@/components/CastingCalls";
import { useParams, Link } from "@/lib/router-next";
import BackButton from "@/components/BackButton";
import { Calendar, MapPin, Users, Share2, CheckCircle, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { publicApi, type PublicCasting, contactApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@/lib/router-next";


type CastingDetail = {
  id: string;
  title: string;
  brand: string;
  date: string;
  location: string;
  slots: number;
  description: string;
  urgent?: boolean;
  image?: string | { src: string };
  categories: string[];
};

const CastingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [casting, setCasting] = useState<CastingDetail | null>(() => {
    const found = fallbackCastings.find((c) => c.id === id);
    return found ? { ...found } : null;
  });
  const [loading, setLoading] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: user?.fullName || "", email: user?.email || "", message: "" });
  const [applyStatus, setApplyStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    if (!id || /^[a-f0-9]{24}$/i.test(id)) {
      setLoading(true);
      publicApi
        .castings()
        .then((list) => {
          const found = list?.find((c: PublicCasting) => c._id === id);
          if (found) {
            setCasting({
              id: found._id,
              title: found.title,
              brand: found.brand || "—",
              date: found.date ? new Date(found.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—",
              location: found.location || "—",
              slots: found.slots ?? 0,
              description: found.description || "",
              categories: found.categories || [],
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setApplyForm((f) => ({
        ...f,
        name: user.fullName || f.name,
        email: user.email || f.email,
      }));
    }
  }, [user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setApplyStatus("submitting");
    setApplyError("");
    try {
      await contactApi.send({
        name: applyForm.name,
        email: applyForm.email,
        message: `[CASTING APPLICATION]\nCasting: ${casting?.title}\nBrand: ${casting?.brand}\nCasting ID: ${id}\nUser ID: ${user?._id || "—"}\n\n${applyForm.message}`,
      });
      setApplyStatus("success");
    } catch (err) {
      setApplyError((err as Error).message || "Failed to submit. Please try again.");
      setApplyStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!casting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Casting Not Found</h1>
          <BackButton label="Back to Castings" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Text-only heading — no image */}
      <div className="pt-24 pb-6 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <BackButton label="Castings" className="mb-4 text-xs tracking-[0.2em] uppercase" />
          <div className="flex flex-wrap gap-1.5 mb-3">
            {casting.urgent && (
              <span className="bg-primary text-primary-foreground text-[9px] font-body font-semibold px-2.5 py-0.5 tracking-[0.2em] uppercase">
                Urgent
              </span>
            )}
            {casting.categories.map((cat) => (
              <span key={cat} className="bg-secondary text-secondary-foreground text-[9px] font-body px-2.5 py-0.5 tracking-[0.15em] uppercase">
                {cat}
              </span>
            ))}
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-1">
            {casting.title}
          </h1>
          {casting.brand && casting.brand !== "—" && (
            <p className="text-primary font-body text-xs tracking-[0.25em] uppercase mt-2">{casting.brand}</p>
          )}
        </div>
      </div>

      {/* Compact details */}
      <div className="pt-6 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-4 mb-6 py-4 border-y border-border">
              <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{casting.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{casting.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>{casting.slots} open position{casting.slots !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Description – trimmed */}
            {casting.description && (
              <p className="text-muted-foreground text-sm font-body leading-relaxed mb-6">
                {casting.description}
              </p>
            )}

            {/* Requirements – minimal */}
            <div className="mb-6">
              <p className="text-[10px] text-muted-foreground font-body tracking-[0.3em] uppercase mb-2">Requirements</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {["18+ years old", "Professional portfolio", "Available for full shoot", "Valid ID required"].map((req) => (
                  <li key={req} className="flex items-center gap-2 text-foreground text-sm font-body">
                    <div className="w-1 h-1 bg-primary flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA row */}
            <div className="flex gap-3 items-center pt-2">
              <button
                onClick={() => setShowApplyModal(true)}
                className="bg-gradient-red text-primary-foreground px-7 py-2.5 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity"
              >
                Apply Now
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: casting.title, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href).catch(() => {});
                  }
                }}
                className="border border-border text-foreground p-2.5 hover:border-primary transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => { if (applyStatus !== "submitting") setShowApplyModal(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-background magazine-border p-8 w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto">
                {applyStatus === "success" ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-3xl text-foreground mb-2">Application Sent!</h3>
                    <p className="text-muted-foreground font-body text-sm mb-6">
                      Your application for <strong>{casting.title}</strong> has been submitted. We&apos;ll be in touch soon.
                    </p>
                    <button
                      onClick={() => { setShowApplyModal(false); setApplyStatus("idle"); }}
                      className="btn-primary inline-flex"
                    >
                      Close
                    </button>
                  </div>
                ) : !user ? (
                  <div className="text-center py-4">
                    <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-3xl text-foreground mb-2">Sign in Required</h3>
                    <p className="text-muted-foreground font-body text-sm mb-6">
                      You need to be logged in to apply for castings.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link to="/login" className="btn-primary inline-flex">Log In</Link>
                      <Link to="/signup" className="border border-border px-5 py-2 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-1">Apply For</p>
                        <h3 className="font-display text-2xl text-foreground">{casting.title}</h3>
                      </div>
                      <button
                        onClick={() => setShowApplyModal(false)}
                        className="text-muted-foreground hover:text-foreground text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                    {applyError && (
                      <p className="text-destructive font-body text-sm mb-4">{applyError}</p>
                    )}
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          value={applyForm.name}
                          onChange={(e) => setApplyForm((f) => ({ ...f, name: e.target.value }))}
                          className="form-input"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          required
                          value={applyForm.email}
                          onChange={(e) => setApplyForm((f) => ({ ...f, email: e.target.value }))}
                          className="form-input"
                          placeholder="Your email address"
                        />
                      </div>
                      <div>
                        <label className="form-label">Message (Optional)</label>
                        <textarea
                          rows={3}
                          value={applyForm.message}
                          onChange={(e) => setApplyForm((f) => ({ ...f, message: e.target.value }))}
                          className="form-input resize-none"
                          placeholder="Tell us why you're a great fit..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={applyStatus === "submitting"}
                        className="btn-primary inline-flex items-center gap-2 w-full justify-center"
                      >
                        {applyStatus === "submitting" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                        ) : (
                          "Submit Application"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CastingDetailPage;
