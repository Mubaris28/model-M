import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "@/lib/router-next";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";
import FlowStepper from "@/components/FlowStepper";

const DRAFT_KEY = "register-professional-draft";

const defaultForm = {
  company: "",
  type: "",
  brn: "",
  website: "",
  services: "",
  location: "",
  phone: "",
  email: "",
  bio: "",
};

function loadDraft(userId: string) {
  try {
    const raw = localStorage.getItem(`${DRAFT_KEY}-${userId}`);
    if (raw) return { ...defaultForm, ...JSON.parse(raw) };
  } catch (_) {}
  return defaultForm;
}

function saveDraft(userId: string, data: typeof defaultForm) {
  try {
    localStorage.setItem(`${DRAFT_KEY}-${userId}`, JSON.stringify(data));
  } catch (_) {}
}

const RegisterPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = user?._id ?? "";

  useEffect(() => {
    if (userId) setForm(loadDraft(userId));
  }, [userId]);

  const persistDraft = useCallback(() => {
    if (userId) saveDraft(userId, form);
  }, [userId, form]);

  useEffect(() => {
    const t = setTimeout(persistDraft, 500);
    return () => clearTimeout(t);
  }, [form, persistDraft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      await authApi.updateProfile({
        profileComplete: true,
        status: "pending",
        company: form.company,
        fullName: user?.fullName,
        phone: form.phone || user?.phone,
      });
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
          className="max-w-lg mx-auto"
        >
          <FlowStepper currentStep={3} className="mb-6" />
          <h1 className="font-display text-5xl mb-2">Professional Registration</h1>
          <p className="text-muted-foreground text-sm font-body mb-8">Set up your professional profile. Your progress is saved automatically.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Company / business name *</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="form-input" placeholder="Your company" required />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-input">
                <option value="">Select</option>
                <option value="photographer">Photographer</option>
                <option value="brand">Brand</option>
                <option value="agency">Agency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">BRN (optional)</label>
              <input type="text" value={form.brn} onChange={(e) => setForm({ ...form, brn: e.target.value })} className="form-input" placeholder="Business registration number" />
            </div>
            <div>
              <label className="form-label">Website</label>
              <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="form-input" placeholder="https://yoursite.com" />
            </div>
            <div>
              <label className="form-label">Services offered</label>
              <input type="text" value={form.services} onChange={(e) => setForm({ ...form, services: e.target.value })} className="form-input" placeholder="Photography, Casting, etc." />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="form-input" placeholder="City, Country" />
            </div>
            <div>
              <label className="form-label">Contact phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" placeholder="+230..." />
            </div>
            <div>
              <label className="form-label">About</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="form-input min-h-[120px] resize-none" placeholder="Tell us about your work..." />
            </div>
            {error && (
              <div className="rounded-md bg-primary/10 border border-primary/30 p-3 text-primary text-sm font-body">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Submitting..." : "Complete registration"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
