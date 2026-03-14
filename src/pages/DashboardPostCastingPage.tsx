import { useState } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useNavigate } from "@/lib/router-next";
import { castingApi, type CastingBody, uploadFile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, CheckCircle } from "lucide-react";

const CASTING_TYPES = [
  "Fashion / Editorial",
  "Commercial / Advertising",
  "TV / Film",
  "Runway / Show",
  "Fitness / Sports",
  "Beauty / Cosmetics",
  "Lifestyle / Social Media",
  "Print / Catalogue",
  "Other",
];

const LOCATIONS = [
  "Port Louis",
  "Ebène / Cybercity",
  "Grand Baie",
  "Flic en Flac",
  "Tamarin",
  "Mahébourg",
  "Curepipe",
  "Rose Hill",
  "Remote / Online",
  "Other",
];

type FormState = {
  title: string;
  brand: string;
  castingType: string;
  location: string;
  date: string;
  slots: string;
  description: string;
};

const defaultForm: FormState = {
  title: "",
  brand: "",
  castingType: "",
  location: "",
  date: "",
  slots: "1",
  description: "",
};

const DashboardPostCastingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.castingType) { setError("Please select a casting type."); return; }
    if (!form.location) { setError("Please select a location."); return; }
    setError(null);
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadFile(imageFile, "casting");
      }

      const body: CastingBody = {
        title: form.title.trim(),
        brand: form.brand.trim(),
        castingType: form.castingType,
        location: form.location,
        date: form.date || undefined,
        slots: form.slots ? Number(form.slots) : 1,
        description: form.description.trim(),
        imageUrl,
      };
      await castingApi.create(body);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Failed to post casting. Please try again.");
    } finally {
      setUploadingImage(false);
      setSubmitting(false);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Max 10MB.");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-lg text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-4xl mb-2">Casting Submitted!</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Your casting call has been submitted for review. It will appear publicly once our team approves it — usually within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard/my-castings")}
              className="btn-primary"
            >
              View My Castings
            </button>
            <button
              onClick={() => { setForm(defaultForm); setSuccess(false); }}
              className="border border-border px-5 py-2 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-2xl">
        <BackButton label="Back to Dashboard" className="mb-8" />
        <h1 className="font-display text-4xl text-primary mb-1">Post a Casting</h1>
        <p className="text-muted-foreground font-body text-sm mb-8">
          Fill in the details below. Your casting will be reviewed and published within 24 hours.
        </p>

        {user?.status !== "approved" && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 text-sm font-body text-yellow-800">
            <strong>Note:</strong> Your account must be approved before casting calls go live. They will be queued for review.
          </div>
        )}

        <form onSubmit={handleSubmit} className="magazine-border p-6 md:p-8 space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body px-4 py-3">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="form-label">Casting Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={set("title")}
              className="form-input"
              placeholder="e.g. Commercial shoot for summer collection"
              maxLength={100}
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className="form-label">Brand / Company Name</label>
            <input
              type="text"
              value={form.brand}
              onChange={set("brand")}
              className="form-input"
              placeholder="Your brand or company name"
              maxLength={80}
            />
          </div>

          {/* Casting photo */}
          <div>
            <label className="form-label">Casting Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="form-input"
            />
            <p className="text-muted-foreground text-xs font-body mt-1">Recommended: JPG/PNG/WebP, up to 10MB.</p>
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Casting preview" className="w-full max-w-sm rounded-sm border border-border object-cover" />
              </div>
            )}
          </div>

          {/* Type + Location row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Casting Type *</label>
              <select
                value={form.castingType}
                onChange={set("castingType")}
                className="form-input"
                required
              >
                <option value="">Select type...</option>
                {CASTING_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Location *</label>
              <select
                value={form.location}
                onChange={set("location")}
                className="form-input"
                required
              >
                <option value="">Select location...</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Slots row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Casting Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set("date")}
                className="form-input"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="form-label">Number of Positions</label>
              <input
                type="number"
                value={form.slots}
                onChange={set("slots")}
                className="form-input"
                min={1}
                max={100}
                placeholder="1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description & Requirements</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={set("description")}
              className="form-input resize-none"
              placeholder="Describe the casting — what you're looking for, experience required, pay, schedule, dress code, etc."
              maxLength={1000}
            />
            <p className="text-muted-foreground text-xs font-body mt-1">{form.description.length}/1000</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="btn-primary inline-flex items-center gap-2"
            >
              {submitting || uploadingImage ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {uploadingImage ? "Uploading image..." : "Submitting..."}</>
              ) : (
                "Submit Casting"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="border border-border px-5 py-2 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardPostCastingPage;
