import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allModels } from "@/components/FeaturedModels";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Ruler, Calendar, Share2, Instagram } from "lucide-react";
import { motion } from "framer-motion";

const ModelProfile = () => {
  const { id } = useParams();
  const model = allModels.find((m) => m.id === id);

  if (!model) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Model Not Found</h1>
          <Link to="/models" className="text-primary font-body text-sm mt-4 inline-block">← Back to Models</Link>
        </div>
      </div>
    );
  }

  const galleryImages = [model.image, model.image, model.image, model.image, model.image, model.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container mx-auto px-4 md:px-6">
          <Link to="/models" className="inline-flex items-center gap-2 text-muted-foreground text-xs font-body tracking-wider uppercase hover:text-primary transition-colors py-4">
            <ArrowLeft className="w-3 h-3" /> Back to Models
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-5"
            >
              <div className="aspect-[3/4] overflow-hidden magazine-border sticky top-24">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="mb-2">
                <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">{model.category}</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl text-foreground mb-4">{model.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-body mb-8">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {model.location}</span>
                <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-primary" /> {model.height}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> Age {model.age}</span>
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary" /> {model.likes.toLocaleString()} likes</span>
              </div>

              <div className="flex gap-3 mb-10">
                <button className="bg-gradient-red text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity">
                  Book Now
                </button>
                <button className="border border-border text-foreground px-6 py-3 font-body tracking-[0.15em] uppercase text-sm hover:border-primary transition-colors flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Save
                </button>
                <button className="border border-border text-foreground p-3 hover:border-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Height", value: model.height },
                  { label: "Bust", value: "34\"" },
                  { label: "Waist", value: "24\"" },
                  { label: "Hips", value: "35\"" },
                  { label: "Shoe", value: "8 US" },
                  { label: "Eyes", value: "Brown" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-card magazine-border p-4 text-center">
                    <p className="text-muted-foreground text-[10px] font-body tracking-[0.2em] uppercase mb-1">{stat.label}</p>
                    <p className="font-display text-xl text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <h3 className="font-display text-2xl text-foreground mb-3">About</h3>
                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {model.name} is an internationally recognized model with experience in editorial, commercial, and runway work.
                  Based in {model.location}, she has worked with top brands and photographers worldwide. Known for her striking
                  presence and versatility, she brings a unique energy to every project.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <span className="text-muted-foreground text-xs font-body">@{model.name.toLowerCase().replace(/\s/g, "")}</span>
              </div>

              {/* Gallery */}
              <div className="mt-12">
                <h3 className="font-display text-2xl text-foreground mb-4">Portfolio</h3>
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="aspect-square overflow-hidden magazine-border">
                      <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default ModelProfile;
