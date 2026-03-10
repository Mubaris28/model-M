import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsSection from "@/components/StatsSection";
import heroImg from "@/assets/hero-model.jpg";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={typeof heroImg === "string" ? heroImg : heroImg.src} alt="About ÉLITE" className="w-full h-full object-cover" />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 cinematic-overlay-left" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-end pb-16">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Our Story</p>
            <h1 className="font-display text-6xl md:text-8xl text-foreground">About ÉLITE</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h2 className="font-display text-3xl text-foreground mb-4 line-accent">Our Mission</h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              ÉLITE Models is the world's premier platform for model management and casting. We connect exceptional talent with 
              top brands, photographers, and creative directors worldwide. Our mission is to democratize the modeling industry 
              while maintaining the highest standards of professionalism and artistry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "For Models", text: "Whether you're an established professional or a fresh face, our platform provides the tools and exposure you need to build a successful career in modeling." },
              { title: "For Clients", text: "Browse our extensive roster of talent across every category. From commercial to editorial, fitness to artistic — find the perfect model for your project." },
            ].map((item) => (
              <div key={item.title} className="bg-card magazine-border p-8">
                <h3 className="font-display text-2xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-3xl text-foreground mb-4 line-accent">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Diversity", text: "We celebrate beauty in all its forms. Our roster represents models of every background, body type, and style." },
                { title: "Professionalism", text: "We maintain the highest industry standards for both our models and clients." },
                { title: "Innovation", text: "We leverage technology to create seamless connections between talent and opportunity." },
              ].map((val) => (
                <div key={val.title} className="bg-card magazine-border p-6">
                  <div className="w-2 h-2 bg-primary mb-4" />
                  <h4 className="font-display text-xl text-foreground mb-2">{val.title}</h4>
                  <p className="text-muted-foreground text-xs font-body leading-relaxed">{val.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <StatsSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
