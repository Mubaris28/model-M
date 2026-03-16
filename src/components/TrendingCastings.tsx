import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { publicApi, type PublicCasting } from "@/lib/api";
import { imgSrc } from "@/lib/utils";

// Card image display: 300px (mobile) or 340px (md+) wide, aspect 16:9. Recommended upload size: 680×383 px (or 1280×720 for high-DPI).
const CASTING_CARD_IMAGE_WIDTH = 680;
const CASTING_CARD_IMAGE_HEIGHT = 383; // 16:9

type CastingCard = { id: string; title: string; brand: string; date: string; location: string; slots: number; categories: string[]; imageUrl: string; urgent?: boolean };

function toCastingCard(c: PublicCasting): CastingCard {
  const dateStr = c.date ? new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  return {
    id: c._id,
    title: c.title,
    brand: c.brand || "—",
    date: dateStr,
    location: c.location || "—",
    slots: c.slots ?? 0,
    categories: c.castingType ? [c.castingType] : [],
    imageUrl: c.imageUrls?.[0] || "",
  };
}

const TrendingCastings = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [castings, setCastings] = useState<CastingCard[]>([]);

  useEffect(() => {
    publicApi
      .sectionsTrendingCastings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingCard));
      })
      .catch(() => {
        publicApi.castings().then((list) => {
          if (list?.length) setCastings(list.map(toCastingCard));
        }).catch(() => {});
      });
  }, []);

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
          {castings.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm py-4">No castings to show yet.</p>
          ) : (
            castings.map((casting, i) => (
            <motion.div
              key={casting.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex-shrink-0 w-[300px] md:w-[340px] snap-start"
            >
              <Link to={`/casting/${casting.id}`} className="group block bg-background magazine-border overflow-hidden hover:border-primary/30 transition-all duration-300 h-full">
                {/* Casting image or gradient placeholder */}
                <div className="relative w-full aspect-video overflow-hidden">
                  {casting.imageUrl ? (
                    <img
                      src={imgSrc(casting.imageUrl)}
                      alt={casting.title}
                      width={CASTING_CARD_IMAGE_WIDTH}
                      height={CASTING_CARD_IMAGE_HEIGHT}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="font-display text-4xl text-primary/30 uppercase truncate px-4">{casting.brand !== "—" ? casting.brand : casting.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {casting.urgent && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-body font-medium px-2.5 py-1 tracking-[0.2em] uppercase">
                      Urgent
                    </span>
                  )}
                  <div className="absolute top-3 right-3 w-8 h-8 border border-white/20 flex items-center justify-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-primary text-xs font-body tracking-wider uppercase mb-1">{casting.brand}</p>
                  <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                    {casting.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 text-muted-foreground text-xs font-body mb-3">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {casting.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {casting.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {casting.categories.map((cat) => (
                      <span key={cat} className="bg-secondary text-secondary-foreground text-[10px] font-body px-2.5 py-0.5 tracking-[0.15em] uppercase">{cat}</span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingCastings;
