import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Megaphone } from "lucide-react";

const DashboardPostCastingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">Post a Casting</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">Create a new casting call. Title, description, location, timeline, and model requirements.</p>
      <div className="magazine-border p-8 text-center">
        <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm">Full post-casting form will be added here (type, basics, location, payment, requirements, etc.).</p>
      </div>
    </div>
  </div>
);

export default DashboardPostCastingPage;
