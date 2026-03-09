import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { User, Save, Globe, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TabId = "personal" | "public" | "notifications";

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "personal", label: "Personal", icon: User },
  { id: "public", label: "Public", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const DashboardAccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [saved, setSaved] = useState(false);

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
                    <input type="text" defaultValue={user?.fullName || ""} className="form-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" value={user?.email || ""} readOnly className="form-input bg-secondary text-muted-foreground" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="form-label">Phone</label>
                    <input type="tel" defaultValue={user?.phone || ""} className="form-input" placeholder="+230..." />
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
                    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-xs font-body">Photo</div>
                    <div>
                      <button type="button" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:underline">Upload photo</button>
                      <p className="text-muted-foreground text-[10px] mt-1">JPEG, PNG. Max 2MB.</p>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea rows={4} className="form-input min-h-[120px] resize-none" placeholder="A short bio for your public profile" />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <select className="form-input">
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
              <button type="button" onClick={() => setSaved(true)} className="btn-primary">
                <Save className="w-4 h-4" /> Save
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
