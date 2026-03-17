import { useState } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { useNavigate } from "@/lib/router-next";
import { castingApi, type CastingBody, uploadFilesWithProgress } from "@/lib/api";
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
  price: string;
  applicationDeadline: string;
};

const defaultForm: FormState = {
  title: "",
  brand: "",
  castingType: "",
  location: "",
  date: "",
  slots: "1",
  description: "",
  price: "",
  applicationDeadline: "",
};

const DashboardPostCastingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [customLocation, setCustomLocation] = useState("");

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.castingType) { setError("Please select a casting type."); return; }
    if (!form.location) { setError("Please select a location."); return; }
    if (form.location === "Other" && !customLocation.trim()) { setError("Please enter a custom location."); return; }
    const resolvedLocation = form.location === "Other" ? customLocation.trim() : form.location;
    setError(null);
    setSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setUploadingImage(true);
        setUploadProgress(0);
        imageUrls = await uploadFilesWithProgress(imageFiles, "casting", setUploadProgress);
      }

      const body: CastingBody = {
        title: form.title.trim(),
        brand: form.brand.trim(),
        castingType: form.castingType,
        location: resolvedLocation,
        date: form.date || undefined,
        slots: form.slots ? Number(form.slots) : 1,
        description: form.description.trim(),
        imageUrls,
        price: form.price.trim() || undefined,
        applicationDeadline: form.applicationDeadline || undefined,
      };
      await castingApi.create(body);
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message || "Failed to post casting. Please try again.");
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      setSubmitting(false);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = "";
    if (selected.length === 0) return;
    const remaining = 5 - imageFiles.length;
    if (remaining <= 0) {
      setError("You can add up to 5 photos.");
      return;
    }
    const toAdd = selected.slice(0, remaining);
    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose image files only.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" is too large. Max 10MB per photo.`);
        return;
      }
    }
    setError(null);
    setImageFiles((prev) => [...prev, ...toAdd]);
    setImagePreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-lg text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display text-4xl mb-2">Casting Submitted!</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Your casting call has been submitted for review. It will appear publicly once our team approves it, usually within 24 hours.
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

          {/* Casting photos */}
          <div>
            <label className="form-label">Casting Photos <span className="text-muted-foreground font-normal">(up to 5)</span></label>
            {imageFiles.length < 5 && (
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageChange}
                className="form-input"
              />
            )}
            <p className="text-muted-foreground text-xs font-body mt-1">JPG/PNG/WebP, up to 10MB each. {imageFiles.length}/5 added.</p>
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt={`Photo ${i + 1}`} className="w-full aspect-square object-cover rounded-sm border border-border" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
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
                onChange={(e) => {
                  set("location")(e);
                  if (e.target.value !== "Other") setCustomLocation("");
                }}
                className="form-input"
                required
              >
                <option value="">Select location...</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {form.location === "Other" && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="form-input mt-2"
                  placeholder="Enter location..."
                  maxLength={100}
                  required
                />
              )}
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

          {/* Price + Application Deadline row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="form-label">Price / Compensation</label>
              <input
                type="text"
                value={form.price}
                onChange={set("price")}
                className="form-input"
                placeholder="e.g. Rs 5,000 / Negotiable / Unpaid"
                maxLength={80}
              />
            </div>
            <div>
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                value={form.applicationDeadline}
                onChange={set("applicationDeadline")}
                className="form-input"
                min={new Date().toISOString().split("T")[0]}
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
              placeholder="Describe the casting: what you're looking for, experience required, pay, schedule, dress code, etc."
              maxLength={1000}
            />
            <p className="text-muted-foreground text-xs font-body mt-1">{form.description.length}/1000</p>
          </div>

          {/* Submit */}
          <div className="space-y-3 pt-2">
            {uploadingImage && (
              <div>
                <div className="flex items-center justify-between text-xs font-body text-muted-foreground mb-1.5">
                  <span>Uploading photos...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary h-1.5 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="btn-primary inline-flex items-center gap-2"
              >
                {uploadingImage ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading... {uploadProgress}%</>
                ) : submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardPostCastingPage;
