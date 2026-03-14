import { Heart } from "lucide-react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { publicApi, type PublicModel } from "@/lib/api";
import { TRENDING_NAMES, orderByNames } from "@/lib/homepage-models";

type ModelCard = { id: string; name: string; image: string | { src: string }; category: string; location: string; height: string; likes: number };

function toCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    name: m.username || m.fullName || "Model",
    image: photo,
    category: m.categories?.[0] || "Model",
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    height: m.height || "—",
    likes: 0,
  };
}

const FeaturedModels = () => {
  const [models, setModels] = useState<ModelCard[]>([]);

  useEffect(() => {
    publicApi
      .models()
      .then((list) => {
        if (!list?.length) return;
        const ordered = orderByNames(list, TRENDING_NAMES);
        setModels(ordered.slice(0, 6).map(toCard));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="models" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Featured</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">Trending Models</h2>
          </div>
          <Link to="/models" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors">
            View All →
          </Link>
        </div>

        <div className="mobile-slider gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
          {models.length === 0 && (
            <p className="col-span-full text-muted-foreground font-body text-sm py-8">No models to show yet. Check back soon.</p>
          )}
          {models.slice(0, 6).map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link to={`/model/${model.id}`} className="group relative block aspect-[3/4] min-h-[240px] md:min-h-[280px] overflow-hidden magazine-border">
                <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 cinematic-overlay" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">{model.category}</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <h3 className="font-display text-3xl text-white">{model.name}</h3>
                  <div className="flex items-center gap-3 mt-2 text-white/60 text-xs font-body tracking-wider flex-wrap">
                    <span>{model.location}</span>
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span>{model.height}</span>
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-primary" /> {model.likes.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModels;
