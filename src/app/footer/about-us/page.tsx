import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

export default function FooterAboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">About Us</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">Transforming the Modeling Industry</p>
          <div className="mt-12 space-y-8">
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Model Management Mauritius is an innovative online platform dedicated to revolutionizing the way models and talents connect with client across the Indian Ocean. Founded by Basant Lallah, Managing Director of Flash Communications Ltd., our platform streamlines the process of sourcing diverse talent for a wide range of projects.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card magazine-border p-8">
                <h2 className="font-display text-2xl text-foreground mb-3">For Aspiring and Established Models</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">Whether you are a beginner, a professional model, an influencer, or simply exploring opportunities to showcase your unique look, we welcome you to join our inclusive community. We believe that diversity enriches the industry, and modeling is an opportunity accessible to all.</p>
              </div>
              <div className="bg-card magazine-border p-8">
                <h2 className="font-display text-2xl text-foreground mb-3">For Clients and Industry Professionals</h2>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">Photographers, brands, casting directors, agencies, small businesses, and production companies can post paid jobs, collaboration shoots, or other projects. Our platform provides direct access to a carefully curated selection of talented and diverse models, enabling you to find the perfect match for your creative vision.</p>
              </div>
            </div>
            <div className="bg-card magazine-border p-8">
              <h2 className="font-display text-2xl text-foreground mb-4">Full-Service Campaign Management</h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">For comprehensive campaign management, our experienced casting team is available to assist. Please contact us to discuss your requirements and let us help bring your vision to fruition.</p>
              <Link to="/contact" className="btn-primary inline-flex">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
