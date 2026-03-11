import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsSection from "@/components/StatsSection";
import heroImg from "@/assets/hero-model.jpg";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={typeof heroImg === "string" ? heroImg : heroImg.src} alt="About Us" className="w-full h-full object-cover" />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 cinematic-overlay-left" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-end pb-16">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Our Story</p>
            <h1 className="font-display text-6xl md:text-8xl text-foreground">About Us</h1>
            <p className="font-body text-lg text-white/90 mt-2">Transforming the Modeling Industry</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Model Management Mauritius is an innovative online platform dedicated to revolutionizing the way models and talents connect with clients across the globe. Founded by Basant Lallah, Managing Director of Flash Communications Ltd., our platform streamlines the process of sourcing diverse talent for a wide range of projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "For Aspiring and Established Models", text: "Whether you are a beginner, a professional model, an influencer, or simply exploring opportunities to showcase your unique look, we welcome you to join our inclusive community. We believe that diversity enriches the industry, and modeling is an opportunity accessible to all." },
              { title: "For Clients and Industry Professionals", text: "Photographers, brands, casting directors, agencies, small businesses, and production companies can post paid jobs, collaboration shoots, or other projects. Our platform provides direct access to a carefully curated selection of talented and diverse models, enabling you to find the perfect match for your creative vision." },
            ].map((item) => (
              <div key={item.title} className="bg-card magazine-border p-8">
                <h3 className="font-display text-2xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-card magazine-border p-8">
            <h2 className="font-display text-3xl text-foreground mb-4 line-accent">Full-Service Campaign Management</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
              For comprehensive campaign management, our experienced casting team is available to assist. Please contact us to discuss your requirements and let us help bring your vision to fruition.
            </p>
            <Link to="/contact" className="btn-primary inline-flex">Contact Us</Link>
          </div>
        </motion.div>
      </div>

      <StatsSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
