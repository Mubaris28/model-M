import Navbar from "@/components/Navbar";
import { Link } from "@/lib/router-next";
import BackButton from "@/components/BackButton";
import { Star, Check } from "lucide-react";

const DashboardPremiumPage = () => {
  const benefits = [
    "Unlimited profile views",
    "Featured in model directory",
    "Priority casting applications",
    "Direct booking requests",
    "Analytics dashboard",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <BackButton label="Back to Dashboard" className="mb-8" />
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Go Premium</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Get more visibility and opportunities</p>
          <div className="magazine-border p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-foreground">Premium Member</h2>
                <p className="text-muted-foreground text-sm font-body">Unlock all features</p>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm font-body">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="inline-block bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90">
              Contact to Upgrade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPremiumPage;
