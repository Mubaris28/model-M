import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Partners</p>
          <h1 className="font-display text-6xl md:text-8xl line-accent">Partners</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">
            We work with brands, agencies, and industry partners to create opportunities for models and talent. Get in touch to explore partnerships.
          </p>
          <Link to="/contact" className="btn-primary inline-flex mt-8">Contact Us</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
