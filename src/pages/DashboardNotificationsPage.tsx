import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell } from "lucide-react";

const DashboardNotificationsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground text-sm font-body hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-2">Notifications</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Casting updates, messages, and activity</p>
          <div className="magazine-border p-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-body">No new notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotificationsPage;
