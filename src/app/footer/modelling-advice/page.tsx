import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";

const adviceCards = [
  { to: "/footer/modelling-advice/practical-tips", title: "Practical Tips for Models", desc: "Our best advice for aspiring models in Mauritius—from professionalism to self-care" },
  { to: "/footer/modelling-advice/best-shoots", title: "Tips for the Best Shoots", desc: "What every model should know before stepping in front of the camera" },
  { to: "/footer/modelling-advice/model-academies", title: "Model Academies & Training", desc: "Learn, grow, and gain confidence through professional training programs" },
  { to: "/footer/modelling-advice/modeling-workshops", title: "Modeling Workshops", desc: "Discover workshops that help you refine your skills and build confidence" },
  { to: "/footer/modelling-advice/real-model", title: "How is a Real Model", desc: "What to expect from a real modeling journey—the dedication and rewards" },
  { to: "/footer/modelling-advice/aspiring-models", title: "Aspiring Models", desc: "Your first confident steps into the world of modeling" },
  { to: "/footer/modelling-advice/glossary", title: "Glossary of Modeling Terms", desc: "Learn the key modeling terms you'll hear every day in the industry" },
  { to: "/footer/modelling-advice/build-portfolio", title: "Build the Right Portfolio", desc: "Show your best self with a professional, authentic portfolio" },
  { to: "/footer/modelling-advice/discover-confidence", title: "Discover Your Confidence", desc: "Explore different types of modeling and find where you belong" },
  { to: "/footer/modelling-advice/self-photography", title: "Capture Your Own Photos", desc: "How to take professional modeling photos yourself with confidence" },
];

export default function ModellingAdvicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl line-accent">Modelling Advice</h1>
          <p className="font-body text-lg text-muted-foreground mt-4">Explore our expert modelling tips and guidance to help you succeed in your career</p>
          <p className="text-muted-foreground font-body text-sm mt-6 leading-relaxed">
            Every model—whether just starting out or already established—needs guidance at some point. Our collection of advice articles is designed to help you save time, avoid common mistakes, and make confident decisions throughout your modelling journey in Mauritius and beyond.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {adviceCards.map((item) => (
              <Link key={item.to} to={item.to} className="group bg-card magazine-border p-6 block hover:border-primary/30 transition-colors">
                <h2 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
                <p className="text-muted-foreground text-xs font-body leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
