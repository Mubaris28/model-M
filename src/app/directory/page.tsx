import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Premium</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Premium</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">
            Access exclusive benefits, verified talent, and priority support. Join as a premium member to get the most out of Model Management Mauritius.
          </p>
          <Link to="/signup" className="btn-primary inline-flex mt-8">Get Started</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
