import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, uploadFiles } from "@/lib/api";

const DashboardUpdatePortfolioPage = () => {
  const { user, refreshUser } = useAuth();
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPortfolioUrls(user?.portfolio ?? []);
  }, [user?.portfolio]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const space = 6 - portfolioUrls.length;
    if (space <= 0) {
      setError("Maximum 6 portfolio images.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const list = Array.from(files).slice(0, space);
      const urls = await uploadFiles(list, "portfolio");
      setPortfolioUrls((prev) => [...prev, ...urls].slice(0, 6));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const remove = (index: number) => {
    setPortfolioUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (portfolioUrls.length < 4) {
      setError("Please upload at least 4 portfolio images (4–6 required).");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await authApi.updateProfile({ portfolio: portfolioUrls });
      await refreshUser();
      setMessage("Portfolio saved.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
        <BackButton label="Back to Dashboard" className="mb-8" />
        <h1 className="font-display text-4xl text-primary mb-2">Update Portfolio</h1>
        <p className="text-muted-foreground font-body text-sm mb-8">Upload and manage your portfolio photos (4–6 images).</p>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={onFileChange}
        />

        <div className="magazine-border p-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => portfolioUrls.length < 6 && inputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && portfolioUrls.length < 6 && inputRef.current?.click()}
            className="border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            ) : (
              <ImagePlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            )}
            <p className="text-muted-foreground font-body text-sm">
              {portfolioUrls.length > 0 ? `${portfolioUrls.length}/6 — click to add more` : "Click to upload — JPG, PNG, WebP. Min 4, max 6."}
            </p>
          </div>

          {portfolioUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              {portfolioUrls.map((url, i) => (
                <div key={url} className="relative aspect-[3/4] rounded overflow-hidden bg-secondary">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="absolute top-1 right-1 w-7 h-7 bg-black/60 flex items-center justify-center text-white rounded-full hover:bg-black/80"
                    aria-label="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="mt-4 text-destructive text-sm font-body">{error}</p>}
          {message && <p className="mt-4 text-primary text-sm font-body">{message}</p>}

          <div className="mt-6 flex gap-3">
            <button type="button" onClick={handleSave} disabled={saving || portfolioUrls.length < 4} className="btn-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save portfolio"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpdatePortfolioPage;
