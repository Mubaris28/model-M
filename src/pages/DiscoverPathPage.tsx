import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const discoverPaths: Record<string, { title: string; description: string }> = {
  "im-new-to-the-spotlight": {
    title: "Where new faces begin their modeling careers",
    description: "Set up your profile, showcase your photos, get noticed, and start your journey.",
  },
  "im-a-full-time-model": {
    title: "Full-Time Model Path",
    description: "Explore opportunities for established models.",
  },
  "were-more-than-a-brand": {
    title: "We're more than a brand",
    description: "Are you a model looking to refine your image and grow your opportunities? We're here to help.",
  },
  "we-are-your-go-to-agency": {
    title: "We are your go-to agency",
    description: "Full-Service Campaign Management. Elevate Your Brand with Expert Campaign Solutions.",
  },
  "im-an-influencer-with-a-passion-for-creating": {
    title: "Influencer & Creator",
    description: "Turn your talent into success.",
  },
  "im-a-creative-photographer": {
    title: "Creative Photographer",
    description: "Turn your talent into success.",
  },
  "im-a-stylist": {
    title: "Stylist",
    description: "Turn your talent into success.",
  },
  "im-a-talent-artist": {
    title: "Talent Artist",
    description: "Turn your talent into success.",
  },
};

const DiscoverPathPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const path = slug ? discoverPaths[slug] : null;

  if (!path) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6">
          <p className="text-muted-foreground">Page not found.</p>
          <Link to="/" className="text-primary text-sm font-body mt-4 inline-block">Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Discover</p>
            <h1 className="font-display text-4xl md:text-6xl line-accent mb-6">{path.title}</h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-10">{path.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="bg-gradient-red text-primary-foreground px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 transition-opacity">
                Get Started
              </Link>
              <Link to="/contact" className="border border-border px-6 py-3 font-body text-sm tracking-[0.15em] uppercase hover:border-primary hover:text-primary transition-colors">
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiscoverPathPage;
