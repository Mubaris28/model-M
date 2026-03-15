import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { User, Save, Globe, Bell, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { authApi, uploadFile } from "@/lib/api";

type TabId = "personal" | "public" | "notifications";

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "public", label: "Public", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const DashboardAccountPage = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setUsername(user?.username ?? "");
    setPhone(user?.phone ?? "");
    setBio(user?.bio ?? "");
    setCountry(user?.country ?? "");
    setProfilePhoto(user?.profilePhoto ?? "");
  }, [user]);

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const url = await uploadFile(file, "profile");
      setProfilePhoto(url);
      await authApi.updateProfile({ profilePhoto: url });
      await refreshUser();
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await authApi.updateProfile({ fullName, username: username || undefined, phone, bio, country: country || undefined, profilePhoto: profilePhoto || undefined });
      await refreshUser();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Account</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Manage your profile and preferences</p>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-xs font-body tracking-[0.1em] uppercase border-b-2 transition-colors -mb-px",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="form-card space-y-6">
            {activeTab === "personal" && (
              <>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-input" placeholder="Your name" />
                  </div>
                  {user?.role === "model" && (
                    <div>
                      <label className="form-label">Username</label>
                      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="Shown on your model card" />
                      <p className="text-muted-foreground text-xs mt-1">Displayed on your model card and profile</p>
                    </div>
                  )}
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" value={user?.email || ""} readOnly className="form-input bg-secondary text-muted-foreground" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" placeholder="+230..." />
                  </div>
                  <div>
                    <label className="form-label">Date of birth</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Location</label>
                    <input type="text" className="form-input" placeholder="City, Country" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "public" && (
              <>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Public profile
                </h2>
                <p className="text-muted-foreground text-xs font-body">What others see. Upload profile picture and add a short bio.</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4">
                    <input id="profile-photo-upload" ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onPhotoChange} disabled={uploadingPhoto} />
                    <label htmlFor="profile-photo-upload" className="cursor-pointer shrink-0">
                      <div
                        className={cn(
                          "w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden",
                          profilePhoto && "ring-2 ring-primary/30"
                        )}
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        ) : profilePhoto ? (
                          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-muted-foreground text-xs font-body">Photo</span>
                        )}
                      </div>
                    </label>
                    <div>
                      <label
                        htmlFor="profile-photo-upload"
                        className={cn("text-primary text-xs font-body tracking-[0.15em] uppercase hover:underline cursor-pointer", uploadingPhoto && "opacity-50 pointer-events-none")}
                      >
                        <Upload className="w-4 h-4 inline mr-1" /> Upload photo
                      </label>
                      <p className="text-muted-foreground text-[10px] mt-1">JPEG, PNG, WebP. Max 10MB.</p>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="form-input min-h-[120px] resize-none" placeholder="A short bio for your public profile" />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <select className="form-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                      <option value="">Select country</option>
                      <option value="MU">Mauritius</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <h2 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notification preferences
                </h2>
                <p className="text-muted-foreground text-xs font-body">Choose how you want to be notified.</p>
                <div className="space-y-4">
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-body">Email notifications</span>
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-body">In-app notifications</span>
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-body">Casting alerts</span>
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                  </label>
                  <label className="flex items-center justify-between gap-4 cursor-pointer">
                    <span className="text-sm font-body">Booking reminders</span>
                    <input type="checkbox" defaultChecked className="accent-primary w-4 h-4" />
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
              <BackButton label="Cancel" />
            </div>
            {saved && <p className="text-primary text-sm font-body">Saved successfully.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccountPage;
