import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Support</h1>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">Need help? Our support team is here for you. Check our FAQ or contact us directly.</p>
          <div className="mt-10 space-y-4">
            <p className="font-body text-sm"><span className="text-foreground font-medium">Contact Support:</span> Email: info@modelmanagement.mu | Phone: +230 468 6969</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/contact" className="btn-primary inline-flex">Contact Form</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
