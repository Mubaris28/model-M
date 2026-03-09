import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { ImagePlus } from "lucide-react";

const DashboardUpdatePortfolioPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">Update Portfolio</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">Upload and manage your portfolio photos (4–6 images).</p>
      <div className="magazine-border p-8 text-center">
        <ImagePlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm">Portfolio upload area will be added here.</p>
      </div>
    </div>
  </div>
);

export default DashboardUpdatePortfolioPage;
