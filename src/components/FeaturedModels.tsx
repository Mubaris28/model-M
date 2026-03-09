import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";

export const allModels = [
  { name: "Sophia Laurent", image: model1, category: "Editorial", age: 24, location: "Paris", height: "5'10\"", likes: 1240, id: "sophia-laurent" },
  { name: "Marco Rossi", image: model2, category: "Commercial", age: 27, location: "Milan", height: "6'1\"", likes: 890, id: "marco-rossi" },
  { name: "Zara Williams", image: model3, category: "Glamour", age: 22, location: "London", height: "5'9\"", likes: 2100, id: "zara-williams" },
  { name: "Mei Lin", image: model4, category: "Haute Couture", age: 25, location: "Tokyo", height: "5'8\"", likes: 1560, id: "mei-lin" },
  { name: "Sophia Laurent", image: model1, category: "Bold", age: 24, location: "Paris", height: "5'10\"", likes: 980, id: "sophia-laurent-2" },
  { name: "Marco Rossi", image: model2, category: "Fitness", age: 27, location: "Milan", height: "6'1\"", likes: 760, id: "marco-rossi-2" },
];

const FeaturedModels = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
    }
  };

  return (
    <section id="models" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Featured</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">Trending Models</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/models" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:inline-block ml-2">
              View All →
            </Link>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {allModels.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <Link to={`/model/${model.id}`} className="group relative block h-[380px] md:h-[440px] overflow-hidden magazine-border">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
