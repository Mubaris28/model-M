import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

const DashboardMyCastingsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">My Castings</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">Manage your posted castings and view applications.</p>
      <div className="magazine-border p-8 text-center">
        <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm mb-4">You haven't posted any castings yet.</p>
        <Link to="/dashboard/post-casting" className="inline-block bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90">Post a Casting</Link>
      </div>
    </div>
  </div>
);

export default DashboardMyCastingsPage;
