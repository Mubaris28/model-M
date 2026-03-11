"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { castings as fallbackCastings } from "@/components/CastingCalls";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { publicApi, type PublicCasting } from "@/lib/api";

type CastingRow = {
  id: string;
  title: string;
  brand: string;
  date: string;
  location: string;
  slots: number;
  description: string;
  urgent?: boolean;
  image?: string | { src: string };
};

function toCastingRow(c: PublicCasting): CastingRow {
  const dateStr = c.date ? new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
  return {
    id: c._id,
    title: c.title,
    brand: c.brand || "—",
    date: dateStr,
    location: c.location || "—",
    slots: c.slots ?? 0,
    description: c.description || "",
  };
}

const CastingPage = () => {
  const [castings, setCastings] = useState<CastingRow[]>(() =>
    fallbackCastings.map((c) => ({
      id: c.id,
      title: c.title,
      brand: c.brand,
      date: c.date,
      location: c.location,
      slots: c.slots,
      description: c.description,
      urgent: c.urgent,
      image: c.image,
    }))
  );

  useEffect(() => {
    publicApi
      .castings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingRow));
      })
      .catch(() => {});
  }, []);

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
            {castings.map((casting, i) => (
              <motion.div
                key={casting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/casting/${casting.id}`} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-6 bg-card magazine-border overflow-hidden hover:border-primary/30 transition-all">
                  <div className="w-full md:w-[240px] h-64 md:h-80 flex-shrink-0 overflow-hidden bg-muted">
                    {casting.image ? (
                      <img src={imgSrc(casting.image)} alt={casting.title} className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm">Casting</div>
                    )}
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
