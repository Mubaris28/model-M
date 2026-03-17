import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { publicApi, type PublicCasting } from "@/lib/api";

type CastingCard = {
  id: string;
  title: string;
  brand: string;
  date: string;
  location: string;
  slots: number;
  categories: string[];
  urgent?: boolean;
};

function toCastingCard(c: PublicCasting): CastingCard {
  const dateStr = c.date
    ? new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  return {
    id: c._id,
    title: c.title,
    brand: c.brand || "",
    date: dateStr,
    location: c.location || "",
    slots: c.slots ?? 0,
    categories: c.castingType ? [c.castingType] : [],
  };
}

const CastingCalls = () => {
  const [castings, setCastings] = useState<CastingCard[]>([]);

  useEffect(() => {
    publicApi
      .castings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingCard));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="casting" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Opportunities</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">Casting Calls</h2>
          </div>
          <Link to="/casting" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:block">
            View All →
          </Link>
        </div>

        <div className="mobile-slider gap-4 md:gap-6" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
          {castings.map((casting, i) => (
            <motion.div
              key={casting.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/casting/${casting.id}`} className="group block bg-background magazine-border overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-48 h-40 sm:h-auto sm:min-w-[200px] flex-shrink-0 overflow-hidden bg-muted" />
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                          {casting.title}
                        </h3>
                        <p className="text-primary text-xs font-body mt-1 tracking-wider">{casting.brand}</p>
                      </div>
                      <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0 ml-4">
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-muted-foreground text-xs font-body mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {casting.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {casting.location}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {casting.slots} slots</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {casting.categories.map((cat) => (
                        <span key={cat} className="bg-secondary text-secondary-foreground text-[10px] font-body px-3 py-1 tracking-[0.15em] uppercase">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          {castings.length === 0 && (
            <p className="col-span-full text-muted-foreground font-body text-sm py-8">No castings to show yet. Check back soon.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CastingCalls;
