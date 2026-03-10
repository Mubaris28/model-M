import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { Store } from "lucide-react";

const DashboardMyMarketplacePage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">My Marketplace</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">Your offers. Post new offers (Premium required).</p>
      <div className="magazine-border p-8 text-center">
        <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm mb-4">No offers yet.</p>
        <Link to="/dashboard/premium" className="text-primary font-body text-sm hover:underline">Upgrade to Premium</Link> to post offers.
      </div>
    </div>
  </div>
);

export default DashboardMyMarketplacePage;
