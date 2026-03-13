import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { motion } from "framer-motion";
import model1 from "@/assets/model-1.jpg";
import model2 from "@/assets/model-2.jpg";
import model3 from "@/assets/model-3.jpg";
import model4 from "@/assets/model-4.jpg";

export const castings = [
  {
    id: "summer-campaign",
    title: "Summer Campaign — Luxury Swimwear",
    brand: "AURA Swim",
    date: "Mar 15, 2026",
    location: "Miami, FL",
    slots: 12,
    categories: ["Bikini", "Commercial"],
    urgent: true,
    description: "Looking for confident models for our Summer 2026 luxury swimwear campaign. Must be comfortable with beach/pool settings.",
    image: model1,
  },
  {
    id: "vogue-editorial",
    title: "Editorial Shoot — Vogue Italia",
    brand: "Vogue",
    date: "Mar 22, 2026",
    location: "Milan, Italy",
    slots: 4,
    categories: ["Editorial", "Bold"],
    urgent: false,
    description: "High fashion editorial for Vogue Italia's upcoming spring issue. Looking for unique faces with strong editorial presence.",
    image: model2,
  },
  {
    id: "fitness-ambassador",
    title: "Fitness Brand Ambassador",
    brand: "APEX Athletics",
    date: "Apr 01, 2026",
    location: "Los Angeles, CA",
    slots: 8,
    categories: ["Fitness", "Commercial"],
    urgent: false,
    description: "Year-long brand ambassador role for leading athletic wear brand. Must have athletic build and social media presence.",
    image: model3,
  },
  {
    id: "fine-art-series",
    title: "Fine Art Photography Series",
    brand: "Gallery Noir",
    date: "Apr 10, 2026",
    location: "New York, NY",
    slots: 6,
    categories: ["Artistic Nude", "Glamour"],
    urgent: true,
    description: "Artistic photography series for gallery exhibition. Tasteful, silhouette-focused work by renowned photographer.",
    image: model4,
  },
];

const CastingCalls = () => {
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
                  <div className="w-full sm:w-48 h-40 sm:h-auto sm:min-w-[200px] flex-shrink-0 overflow-hidden">
                    <img src={imgSrc(casting.image)} alt={casting.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {casting.urgent && (
                      <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-2.5 py-1 tracking-[0.2em] uppercase mb-3 inline-block">
                        Urgent
                      </span>
                    )}
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
        </div>
      </div>
    </section>
  );
};

export default CastingCalls;
