import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { castings } from "@/components/CastingCalls";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CastingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Opportunities</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">Casting Calls</h1>
            <p className="text-muted-foreground font-body text-sm mt-6 max-w-lg">
              Browse the latest open casting calls from top brands and photographers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[...castings, ...castings].map((casting, i) => (
              <motion.div
                key={`${casting.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/casting/${casting.id}`} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-card magazine-border overflow-hidden hover:border-primary/30 transition-all">
                  <div className="w-full md:w-56 h-48 md:h-32 flex-shrink-0 overflow-hidden">
                    <img src={imgSrc(casting.image)} alt={casting.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0 px-4 md:px-0">
                    <div className="flex items-center gap-3 mb-2">
                      {casting.urgent && (
                        <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-2.5 py-0.5 tracking-[0.2em] uppercase">Urgent</span>
                      )}
                      <span className="text-primary text-xs font-body tracking-wider">{casting.brand}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">{casting.title}</h3>
                    <p className="text-muted-foreground text-xs font-body mt-2 line-clamp-2">{casting.description}</p>
                  </div>
                  <div className="flex flex-wrap md:flex-col gap-3 text-muted-foreground text-xs font-body md:text-right px-4 md:px-6 pb-4 md:pb-0">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {casting.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {casting.location}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {casting.slots} slots</span>
                  </div>
                  <div className="hidden md:flex w-10 h-10 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0 mr-4">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <AdBanner />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CastingPage;
