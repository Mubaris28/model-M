import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const caseStudiesData: Record<string, { title: string; description: string }> = {
  "from-struggles-to-success": {
    title: "From Struggles to Success",
    description: "How model management empowers every model",
  },
  "why-we-created-modelmanagement-mauritius": {
    title: "Why Modelmanagement.mu in Mauritius",
    description: "Bridging the gap between local talent and global opportunities",
  },
  "all-faces-all-backgrounds": {
    title: "All Faces. All Backgrounds. One Platform.",
    description: "Where Passion Matters More Than Perfection",
  },
};

const CaseStudyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const study = id ? caseStudiesData[id] : null;

  if (!study) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6">
          <p className="text-muted-foreground">Case study not found.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-primary mt-4 text-sm font-body">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
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
          <Link to="/" className="inline-flex items-center gap-2 text-primary text-xs font-body tracking-[0.15em] uppercase mb-8 hover:text-red-light transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Case Study</p>
            <h1 className="font-display text-4xl md:text-6xl line-accent mb-4">{study.title}</h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">{study.description}</p>
          </motion.article>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CaseStudyDetail;
