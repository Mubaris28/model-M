import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">How We Operate</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">Discover how ModelManagement.mu connects models and professionals in Mauritius</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/footer/how-it-works/models" className="group bg-card magazine-border p-8 block hover:border-primary/30 transition-colors">
              <h2 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">For Models</h2>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">Learn how to create your profile, get discovered, and start your modeling journey in Mauritius</p>
            </Link>
            <Link to="/footer/how-it-works/professionals" className="group bg-card magazine-border p-8 block hover:border-primary/30 transition-colors">
              <h2 className="font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">For Professionals</h2>
              <p className="text-muted-foreground text-sm font-body leading-relaxed">Discover how to find talent, post castings, and build your creative network on our platform</p>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
