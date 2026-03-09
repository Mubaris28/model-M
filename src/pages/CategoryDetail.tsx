import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { categories } from "@/components/MagazineGrid";
import { allModels } from "@/components/FeaturedModels";
import { useParams, Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const CategoryDetail = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Category Not Found</h1>
          <BackButton label="Back to Categories" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 cinematic-overlay-left" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex items-end pb-16">
          <div>
            <BackButton label="Back to Categories" className="mb-4 text-xs tracking-wider uppercase" />
            <h1 className="font-display text-6xl md:text-8xl text-foreground">{category.name}</h1>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-primary text-xs font-body tracking-[0.3em] uppercase">{category.count} Models</span>
              <span className="text-muted-foreground text-xs font-body">{category.description}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...allModels, ...allModels].map((model, i) => (
            <motion.div
              key={`${model.id}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link to={`/model/${model.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-3">
                  <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
                </div>
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-body tracking-wider mt-1">
                  <span>{model.location}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5" /> {model.likes}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <AdBanner />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryDetail;
