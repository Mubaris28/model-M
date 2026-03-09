import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { CreditCard } from "lucide-react";

const DashboardPayoutsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Payouts</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">View your earnings and payout history</p>
          <div className="magazine-border p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body mb-2">No payouts yet</p>
            <p className="text-muted-foreground text-sm font-body">Earnings from bookings will appear here. Add your payout details in Account settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPayoutsPage;
