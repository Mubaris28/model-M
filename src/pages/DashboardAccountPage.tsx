import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const DashboardAccountPage = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Account</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Manage your public information and profile</p>

          <div className="magazine-border p-6 md:p-8 space-y-6">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Public information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ""}
                  className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Email</label>
                <input type="email" value={user?.email || ""} readOnly className="w-full border border-border bg-secondary px-4 py-3 text-sm font-body text-muted-foreground" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Phone</label>
                <input type="tel" defaultValue={user?.phone || ""} className="w-full border border-border bg-background px-4 py-3 text-sm font-body focus:outline-none focus:border-primary" placeholder="+230..." />
              </div>
            </div>
            <p className="text-muted-foreground text-xs font-body">Upload your profile picture from the Public tab. Changes are visible to others once saved.</p>
            <div className="flex gap-3">
              <button onClick={() => setSaved(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90">
                <Save className="w-4 h-4" /> Save
              </button>
              <Link to="/dashboard" className="border border-border px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary">Cancel</Link>
            </div>
            {saved && <p className="text-primary text-sm font-body">Profile updated successfully.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccountPage;
