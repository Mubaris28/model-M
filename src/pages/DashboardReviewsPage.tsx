import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { MessageSquare } from "lucide-react";

const DashboardReviewsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">Reviews</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">Reviews you've received or given.</p>
      <div className="magazine-border p-8 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm">No reviews yet.</p>
      </div>
    </div>
  </div>
);

export default DashboardReviewsPage;
