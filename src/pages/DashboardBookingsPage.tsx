import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { Calendar } from "lucide-react";

const DashboardBookingsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 max-w-3xl">
      <BackButton label="Back to Dashboard" className="mb-8" />
      <h1 className="font-display text-4xl text-primary mb-2">Bookings</h1>
      <p className="text-muted-foreground font-body text-sm mb-8">View and manage your bookings.</p>
      <div className="magazine-border p-8 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground font-body text-sm mb-4">You haven't had any bookings yet.</p>
        <Link to="/casting" className="text-primary font-body text-sm hover:underline">Browse castings</Link>
      </div>
    </div>
  </div>
);

export default DashboardBookingsPage;
