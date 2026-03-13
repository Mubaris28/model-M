import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link, useNavigate } from "@/lib/router-next";
import { castingApi, type MyCasting, type CastingBody } from "@/lib/api";
import { Megaphone, Loader2, Pencil, Trash2, X, CheckCircle, Calendar, MapPin, Users } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const CASTING_TYPES = [
  "Fashion / Editorial", "Commercial / Advertising", "TV / Film", "Runway / Show",
  "Fitness / Sports", "Beauty / Cosmetics", "Lifestyle / Social Media", "Print / Catalogue", "Other",
];

const LOCATIONS = [
  "Port Louis", "Ebène / Cybercity", "Grand Baie", "Flic en Flac", "Tamarin",
  "Mahébourg", "Curepipe", "Rose Hill", "Remote / Online", "Other",
];

type EditForm = {
  title: string;
  brand: string;
  castingType: string;
  location: string;
  date: string;
  slots: string;
  description: string;
};

const DashboardMyCastingsPage = () => {
  const navigate = useNavigate();
  const [castings, setCastings] = useState<MyCasting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editCasting, setEditCasting] = useState<MyCasting | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ title: "", brand: "", castingType: "", location: "", date: "", slots: "1", description: "" });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const loadCastings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await castingApi.mine();
      setCastings(data);
    } catch (err) {
      setError((err as Error).message || "Failed to load castings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCastings();
  }, []);

  const openEdit = (c: MyCasting) => {
    setEditCasting(c);
    setEditForm({
      title: c.title,
      brand: c.brand || "",
      castingType: c.castingType || "",
      location: c.location || "",
      date: c.date ? new Date(c.date).toISOString().split("T")[0] : "",
      slots: String(c.slots ?? 1),
      description: c.description || "",
    });
    setEditError(null);
    setEditSuccess(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCasting) return;
    setSaving(true);
    setEditError(null);
    try {
      const body: Partial<CastingBody> = {
        title: editForm.title.trim(),
        brand: editForm.brand.trim(),
        castingType: editForm.castingType,
        location: editForm.location,
        date: editForm.date || undefined,
        slots: Number(editForm.slots),
        description: editForm.description.trim(),
      };
      const updated = await castingApi.update(editCasting._id, body);
      setCastings((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setEditSuccess(true);
      setTimeout(() => { setEditCasting(null); setEditSuccess(false); }, 1200);
    } catch (err) {
      setEditError((err as Error).message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await castingApi.remove(deleteId);
      setCastings((prev) => prev.filter((c) => c._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError((err as Error).message || "Failed to delete casting.");
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const setEdit = (field: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setEditForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
        <BackButton label="Back to Dashboard" className="mb-8" />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl text-primary">My Castings</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Manage your posted castings.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/post-casting")}
            className="btn-primary text-xs"
          >
            + Post New
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="magazine-border p-12 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground font-body text-sm">Loading your castings...</p>
          </div>
        ) : castings.length === 0 ? (
          <div className="magazine-border p-12 text-center">
            <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-display text-xl mb-2">No castings yet</p>
            <p className="text-muted-foreground font-body text-sm mb-6">Post your first casting call and start finding talent.</p>
            <Link
              to="/dashboard/post-casting"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90"
            >
              Post a Casting
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {castings.map((c) => (
              <div key={c._id} className="magazine-border p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-body font-semibold tracking-[0.2em] uppercase px-2 py-0.5 ${STATUS_STYLES[c.approvalStatus || "pending"] || "bg-secondary text-secondary-foreground"}`}>
                        {c.approvalStatus || "pending"}
                      </span>
                      {c.castingType && (
                        <span className="text-[10px] font-body px-2 py-0.5 bg-secondary text-muted-foreground tracking-wider uppercase">
                          {c.castingType}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl text-foreground truncate">{c.title}</h3>
                    {c.brand && <p className="text-primary text-xs font-body tracking-[0.2em] uppercase">{c.brand}</p>}
                    <div className="flex flex-wrap gap-4 mt-2">
                      {c.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                          <MapPin className="w-3 h-3" /> {c.location}
                        </span>
                      )}
                      {c.date && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                          <Calendar className="w-3 h-3" /> {new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                      {c.slots != null && c.slots > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                          <Users className="w-3 h-3" /> {c.slots} position{c.slots !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {c.description && (
                      <p className="text-muted-foreground text-xs font-body mt-2 line-clamp-2">{c.description}</p>
                    )}
                    <p className="text-muted-foreground text-[10px] font-body mt-2">
                      Posted {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(c)}
                      className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {c.approvalStatus === "rejected" && (
                  <div className="mt-3 pt-3 border-t border-border text-xs text-destructive font-body">
                    This casting was rejected. Edit and resubmit, or contact support.
                  </div>
                )}
                {c.approvalStatus === "pending" && (
                  <div className="mt-3 pt-3 border-t border-border text-xs text-yellow-700 font-body">
                    Under review — will go live once approved by our team.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleting && setDeleteId(null)}>
          <div className="bg-background border border-border p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl mb-2">Delete Casting?</h3>
            <p className="text-muted-foreground font-body text-sm mb-6">This cannot be undone. The casting will be permanently removed.</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-destructive text-destructive-foreground py-2 font-body text-sm uppercase disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 border border-border py-2 font-body text-sm uppercase hover:border-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editCasting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !saving && setEditCasting(null)}>
          <div className="bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-xl text-primary">Edit Casting</h3>
              <button onClick={() => setEditCasting(null)} disabled={saving} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              {editError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body px-4 py-2">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="flex items-center gap-2 text-primary font-body text-sm">
                  <CheckCircle className="w-4 h-4" /> Saved successfully!
                </div>
              )}

              <div>
                <label className="form-label">Title *</label>
                <input type="text" value={editForm.title} onChange={setEdit("title")} className="form-input" required />
              </div>
              <div>
                <label className="form-label">Brand / Company</label>
                <input type="text" value={editForm.brand} onChange={setEdit("brand")} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Casting Type</label>
                  <select value={editForm.castingType} onChange={setEdit("castingType")} className="form-input">
                    <option value="">Select...</option>
                    {CASTING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <select value={editForm.location} onChange={setEdit("location")} className="form-input">
                    <option value="">Select...</option>
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date</label>
                  <input type="date" value={editForm.date} onChange={setEdit("date")} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Positions</label>
                  <input type="number" min={1} max={100} value={editForm.slots} onChange={setEdit("slots")} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={4} value={editForm.description} onChange={setEdit("description")} className="form-input resize-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn-primary inline-flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditCasting(null)} disabled={saving} className="flex-1 border border-border py-2 font-body text-sm uppercase hover:border-primary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMyCastingsPage;
