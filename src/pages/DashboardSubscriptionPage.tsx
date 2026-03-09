import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";

const DashboardSubscriptionPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Subscription</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Manage your plan and billing</p>
          <div className="magazine-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h2 className="font-display text-xl text-foreground">Free Plan</h2>
                <p className="text-muted-foreground text-sm font-body">You're currently on the free tier.</p>
              </div>
            </div>
            <Link to="/dashboard/premium" className="inline-block text-primary font-body text-sm tracking-wider uppercase hover:underline">Upgrade to Premium →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSubscriptionPage;
