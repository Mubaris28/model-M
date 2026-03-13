import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { publicApi, type PublicModel, contactApi } from "@/lib/api";
import { Heart, MapPin, Ruler, Calendar, Share2, Instagram, CheckCircle, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

type DisplayModel = {
  id: string;
  name: string;
  image: string | { src: string };
  category: string;
  location: string;
  height: string;
  age: number;
  likes: number;
  bio: string;
  instagram: string;
  portfolio: (string | { src: string })[];
};

const ObjectIdRegex = /^[a-f0-9]{24}$/i;

const ModelProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [model, setModel] = useState<DisplayModel | null>(null);
  const [loading, setLoading] = useState(!!id && ObjectIdRegex.test(id));
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", email: "", message: "" });
  const [bookStatus, setBookStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [bookError, setBookError] = useState("");

  useEffect(() => {
    if (user) {
      setBookForm((f) => ({ ...f, name: user.fullName || f.name, email: user.email || f.email }));
    }
  }, [user]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookStatus("submitting");
    setBookError("");
    try {
      await contactApi.send({
        name: bookForm.name,
        email: bookForm.email,
        message: `[BOOKING REQUEST]\nModel: ${model?.name}\nModel ID: ${id}\nUser ID: ${user?._id || "—"}\n\n${bookForm.message}`,
      });
      setBookStatus("success");
    } catch (err) {
      setBookError((err as Error).message || "Failed to submit. Please try again.");
      setBookStatus("error");
    }
  };

  useEffect(() => {
    if (!id || !ObjectIdRegex.test(id)) return;
    publicApi
      .model(id)
      .then((m: PublicModel) => {
        const photo = m.profilePhoto || m.portfolio?.[0] || "";
        const age = m.dateOfBirth ? new Date().getFullYear() - new Date(m.dateOfBirth).getFullYear() : 0;
        setModel({
          id: m._id,
          name: m.fullName || "Model",
          image: photo,
          category: m.categories?.[0] || "Model",
          location: [m.city, m.country].filter(Boolean).join(", ") || "—",
          height: m.height || "—",
          age: age || 0,
          likes: 0,
          bio: m.bio || "",
          instagram: m.instagram || "",
          portfolio: m.portfolio?.length ? m.portfolio : [photo],
        });
      })
      .catch(() => setModel(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center text-muted-foreground font-body">Loading...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Model Not Found</h1>
          <BackButton label="Back to Models" className="mt-4" />
        </div>
      </div>
    );
  }

  const galleryImages = model.portfolio.length ? model.portfolio : [model.image, model.image, model.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton label="Back to Models" className="py-4 text-xs tracking-wider uppercase" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-5"
            >
              <div className="aspect-[3/4] overflow-hidden magazine-border sticky top-24">
                <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="mb-2">
                <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">{model.category}</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-foreground mb-4">{model.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-body mb-8">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {model.location}</span>
                <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-primary" /> {model.height}</span>
                {model.age > 0 && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Age {model.age}</span>}
                {model.likes > 0 && <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary" /> {model.likes.toLocaleString()} likes</span>}
              </div>

              <div className="flex gap-3 mb-10">
                <button
                  onClick={() => setShowBookModal(true)}
                  className="bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity"
                >
                  Book Now
                </button>
                <button className="border border-border text-foreground px-6 py-3 font-body tracking-[0.15em] uppercase text-sm hover:border-primary transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Save
                </button>
                <button className="border border-border text-foreground p-3 hover:border-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Height", value: model.height },
                  { label: "Location", value: model.location },
                  { label: "Category", value: model.category },
                ].filter((s) => s.value && s.value !== "—").map((stat) => (
                  <div key={stat.label} className="bg-card magazine-border p-4 text-center">
                    <p className="text-muted-foreground text-[10px] font-body tracking-[0.2em] uppercase mb-1">{stat.label}</p>
                    <p className="font-display text-xl text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              {model.bio && (
                <div className="mb-10">
                  <h3 className="font-display text-2xl text-foreground mb-3">About</h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">{model.bio}</p>
                </div>
              )}

              {(model.instagram || model.bio) && (
                <div className="flex items-center gap-3 mb-10">
                  {model.instagram && (
                    <a
                      href={model.instagram.startsWith("http") ? model.instagram : `https://instagram.com/${model.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  <span className="text-muted-foreground text-xs font-body">{model.instagram ? `@${model.instagram.replace(/^@/, "").split("/").pop()}` : ""}</span>
                </div>
              )}

              {/* Gallery */}
              <div className="mt-12">
                <h3 className="font-display text-2xl text-foreground mb-4">Portfolio</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden magazine-border">
                      <img src={imgSrc(img)} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />

      {/* Book Now Modal */}
      <AnimatePresence>
        {showBookModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => { if (bookStatus !== "submitting") setShowBookModal(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-background magazine-border p-8 w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto">
                {bookStatus === "success" ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-3xl text-foreground mb-2">Request Sent!</h3>
                    <p className="text-muted-foreground font-body text-sm mb-6">
                      Your booking request for <strong>{model?.name}</strong> has been submitted. We&apos;ll be in touch soon.
                    </p>
                    <button
                      onClick={() => { setShowBookModal(false); setBookStatus("idle"); }}
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
                      You need to be logged in to book a model.
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
                        <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-1">Book Model</p>
                        <h3 className="font-display text-2xl text-foreground">{model?.name}</h3>
                      </div>
                      <button
                        onClick={() => setShowBookModal(false)}
                        className="text-muted-foreground hover:text-foreground text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                    {bookError && <p className="text-destructive font-body text-sm mb-4">{bookError}</p>}
                    <form onSubmit={handleBook} className="space-y-4">
                      <div>
                        <label className="form-label">Your Name</label>
                        <input
                          type="text"
                          required
                          value={bookForm.name}
                          onChange={(e) => setBookForm((f) => ({ ...f, name: e.target.value }))}
                          className="form-input"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          required
                          value={bookForm.email}
                          onChange={(e) => setBookForm((f) => ({ ...f, email: e.target.value }))}
                          className="form-input"
                          placeholder="Your email address"
                        />
                      </div>
                      <div>
                        <label className="form-label">Project Details</label>
                        <textarea
                          rows={4}
                          required
                          value={bookForm.message}
                          onChange={(e) => setBookForm((f) => ({ ...f, message: e.target.value }))}
                          className="form-input resize-none"
                          placeholder="Describe your project, dates, budget, and any requirements..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={bookStatus === "submitting"}
                        className="btn-primary inline-flex items-center gap-2 w-full justify-center"
                      >
                        {bookStatus === "submitting" ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                        ) : (
                          "Send Booking Request"
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
    </div>
  );
};

export default ModelProfile;
