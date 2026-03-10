import Navbar from "@/components/Navbar";
import { Link } from "@/lib/router-next";
import BackButton from "@/components/BackButton";
import { Briefcase } from "lucide-react";

const DashboardCastingAppPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Casting Applications</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Track your casting applications and status</p>
          <div className="magazine-border p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-2">No applications yet</p>
            <p className="text-muted-foreground text-sm font-body">Apply to castings from the Casting page to see them here.</p>
            <Link to="/casting" className="inline-block mt-6 text-primary font-body text-sm tracking-wider uppercase hover:underline">Browse Castings</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCastingAppPage;
