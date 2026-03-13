import catBold from "@/assets/cat-bold.jpg";
import catBikini from "@/assets/cat-bikini.jpg";
import catArtistic from "@/assets/cat-artistic.jpg";
import catGlamour from "@/assets/cat-glamour.jpg";
import catCommercial from "@/assets/cat-commercial.jpg";
import catFitness from "@/assets/cat-fitness.jpg";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { motion } from "framer-motion";

export const categories = [
  { name: "Bold", slug: "bold", image: catBold, count: 248, description: "Fearless & striking editorial" },
  { name: "Bikini", slug: "bikini", image: catBikini, count: 186, description: "Beach & swimwear looks" },
  { name: "Artistic Nude", slug: "artistic-nude", image: catArtistic, count: 124, description: "Fine art silhouettes" },
  { name: "Glamour", slug: "glamour", image: catGlamour, count: 312, description: "Red carpet elegance" },
  { name: "Commercial", slug: "commercial", image: catCommercial, count: 428, description: "Brand campaigns" },
  { name: "Fitness", slug: "fitness", image: catFitness, count: 156, description: "Athletic & powerful" },
];

const MagazineGrid = () => {
  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Browse by Category</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">Categories</h2>
          </div>
          <Link to="/categories" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:block">
            View All →
          </Link>
        </div>

        <div className="mobile-slider gap-4 md:gap-6" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link to={`/category/${cat.slug}`} className="group relative block aspect-square overflow-hidden magazine-border">
                <img src={imgSrc(cat.image)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 cinematic-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-2 py-0.5 mb-2 inline-block">{cat.count} Models</span>
                  <h3 className="font-display text-2xl md:text-3xl text-white">{cat.name}</h3>
                  <p className="text-white/60 text-xs font-body mt-1">{cat.description}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                  <ArrowUpRight className="w-3 h-3 text-white/60 group-hover:text-primary-foreground transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineGrid;
