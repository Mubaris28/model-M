import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowRight, ArrowLeft, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import FlowStepper from "@/components/FlowStepper";

const DRAFT_KEY = "become-model-draft";

const defaultStep1 = {
  dateOfBirth: "",
  gender: "",
  country: "",
  city: "",
  height: "",
  weight: "",
  eyeColor: "",
  hairColor: "",
  categories: [] as string[],
  instagram: "",
  bio: "",
};

const defaultStep2 = {
  idNumber: "",
  idPhotoNote: "",
  selfieNote: "",
};

const CATEGORY_OPTIONS = ["Runway", "Commercial", "Editorial", "Fitness", "Fashion", "Swimwear", "Lingerie", "Glamour", "Bold"];

function loadDraft(userId: string): { step1: typeof defaultStep1; step2: typeof defaultStep2 } {
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}-${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        step1: { ...defaultStep1, ...parsed.step1 },
        step2: { ...defaultStep2, ...parsed.step2 },
      };
    }
  } catch (_) {}
  return { step1: defaultStep1, step2: defaultStep2 };
}

function saveDraft(userId: string, step1: typeof defaultStep1, step2: typeof defaultStep2) {
  try {
    localStorage.setItem(`${DRAFT_KEY}-${userId}`, JSON.stringify({ step1, step2 }));
  } catch (_) {}
}

const BecomeModelPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState(defaultStep1);
  const [step2, setStep2] = useState(defaultStep2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = user?._id ?? "";

  useEffect(() => {
    if (userId) {
      const draft = loadDraft(userId);
      setStep1(draft.step1);
      setStep2(draft.step2);
    }
  }, [userId]);

  const persistDraft = useCallback(() => {
    if (userId) saveDraft(userId, step1, step2);
  }, [userId, step1, step2]);

  useEffect(() => {
    const t = setTimeout(persistDraft, 500);
    return () => clearTimeout(t);
  }, [step1, step2, persistDraft]);

  const toggleCategory = (cat: string) => {
    setStep1((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat],
    }));
  };

  const handleContinueToVerification = () => {
    setError(null);
    if (!step1.dateOfBirth?.trim() || !step1.gender?.trim()) {
      setError("Please fill in Date of birth and Gender before continuing.");
      return;
    }
    if (step1.categories.length === 0) {
      setError("Please select at least one modeling category.");
      return;
    }
    persistDraft();
    setStep(2);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await authApi.updateProfile({ profileComplete: true, status: "pending" });
      if (userId) localStorage.removeItem(`${DRAFT_KEY}-${userId}`);
      await refreshUser();
      navigate("/verification-pending");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Link to="/select-role" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">M</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">Model Management</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <FlowStepper currentStep={3} className="mb-6" />
          <h1 className="font-display text-5xl mb-2">Model Application</h1>
          <p className="text-muted-foreground text-sm font-body mb-6">Complete your profile to get discovered. Your progress is saved automatically.</p>

          <div className="flex gap-2 mb-10">
            <div className={`h-1 flex-1 transition-all ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1 flex-1 transition-all ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-2xl mb-4">Step 1 — Personal & portfolio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date of birth</label>
                  <input type="date" value={step1.dateOfBirth} onChange={(e) => setStep1((s) => ({ ...s, dateOfBirth: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Gender</label>
                  <select value={step1.gender} onChange={(e) => setStep1((s) => ({ ...s, gender: e.target.value }))} className="form-input">
                    <option value="">Select</option>
                    <option>Female</option>
                    <option>Male</option>
                    <option>Non-binary</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input type="text" value={step1.country} onChange={(e) => setStep1((s) => ({ ...s, country: e.target.value }))} className="form-input" placeholder="e.g. Mauritius" />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input type="text" value={step1.city} onChange={(e) => setStep1((s) => ({ ...s, city: e.target.value }))} className="form-input" placeholder="e.g. Port Louis" />
                </div>
                <div>
                  <label className="form-label">Height (cm)</label>
                  <input type="number" value={step1.height} onChange={(e) => setStep1((s) => ({ ...s, height: e.target.value }))} className="form-input" placeholder="175" />
                </div>
                <div>
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" value={step1.weight} onChange={(e) => setStep1((s) => ({ ...s, weight: e.target.value }))} className="form-input" placeholder="60" />
                </div>
                <div>
                  <label className="form-label">Eye color</label>
                  <input type="text" value={step1.eyeColor} onChange={(e) => setStep1((s) => ({ ...s, eyeColor: e.target.value }))} className="form-input" placeholder="Brown" />
                </div>
                <div>
                  <label className="form-label">Hair color</label>
                  <input type="text" value={step1.hairColor} onChange={(e) => setStep1((s) => ({ ...s, hairColor: e.target.value }))} className="form-input" placeholder="Black" />
                </div>
              </div>
              <div>
                <label className="form-label">Modeling categories (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`px-4 py-2 text-xs font-body tracking-[0.1em] uppercase border transition-colors ${step1.categories.includes(cat) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary hover:text-primary"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Instagram</label>
                <input type="text" value={step1.instagram} onChange={(e) => setStep1((s) => ({ ...s, instagram: e.target.value }))} className="form-input" placeholder="@username" />
              </div>
              <div>
                <label className="form-label">Bio</label>
                <textarea value={step1.bio} onChange={(e) => setStep1((s) => ({ ...s, bio: e.target.value }))} className="form-input min-h-[120px] resize-none" placeholder="Tell us about yourself..." />
              </div>
              <div>
                <label className="form-label">Portfolio (4–6 images)</label>
                <div className="border-2 border-dashed border-border p-8 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-body">Upload area — JPG, PNG, WebP. Min 4, max 6.</p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs font-body">After clicking continue, your progress is saved. You can complete the verification step later.</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-2xl mb-4">Step 2 — Identity verification</h3>
              <p className="text-muted-foreground text-sm font-body">Your privacy & safety matter. Documents are used only for verification, stored securely, and not shared.</p>
              <div>
                <label className="form-label">ID / Passport number</label>
                <input type="text" value={step2.idNumber} onChange={(e) => setStep2((s) => ({ ...s, idNumber: e.target.value }))} className="form-input" placeholder="e.g. passport number" />
              </div>
              <div>
                <label className="form-label">ID / Passport photo</label>
                <div className="border-2 border-dashed border-border p-6 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-body">Upload one image (JPEG, PNG, WebP)</p>
                </div>
              </div>
              <div>
                <label className="form-label">Selfie with ID</label>
                <div className="border-2 border-dashed border-border p-6 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-xs font-body">One image: selfie holding your ID</p>
                </div>
              </div>
              {error && (
                <div className="rounded-md bg-primary/10 border border-primary/30 p-3 text-primary text-sm font-body">
                  {error}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep(step === 1 ? 1 : step - 1)}
              className={`inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-foreground transition-colors ${step === 1 ? "invisible" : ""}`}
            >
              <ArrowLeft className="w-4 h-4" /> {step === 2 ? "Back to Step 1" : "Back to Role Selection"}
            </button>
            {step === 1 ? (
              <button type="button" onClick={handleContinueToVerification} className="btn-primary">
                Continue to verification <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? "Submitting..." : "Submit application"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeModelPage;
