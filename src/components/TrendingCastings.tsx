import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { useRef } from "react";
import { castings } from "./CastingCalls";

const TrendingCastings = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Opportunities</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">Trending Castings</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link to="/casting" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:inline-block ml-2">
              View All →
            </Link>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory">
          {castings.map((casting, i) => (
            <motion.div
              key={casting.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[320px] md:w-[380px] snap-start"
            >
              <Link to={`/casting/${casting.id}`} className="group block bg-background magazine-border p-6 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {casting.urgent && (
                      <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-2.5 py-1 tracking-[0.2em] uppercase mb-3 inline-block">
                        Urgent
                      </span>
                    )}
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                      {casting.title}
                    </h3>
                    <p className="text-primary text-xs font-body mt-1 tracking-wider">{casting.brand}</p>
                  </div>
                  <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0 ml-4">
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-muted-foreground text-xs font-body mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {casting.date}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {casting.location}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {casting.categories.map((cat) => (
                    <span key={cat} className="bg-secondary text-secondary-foreground text-[10px] font-body px-3 py-1 tracking-[0.15em] uppercase">{cat}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCastings;
