"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { castings as fallbackCastings } from "@/components/CastingCalls";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, Users, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
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
  categories?: string[];
};

function toCastingRow(c: PublicCasting): CastingRow {
  const dateStr = c.date
    ? new Date(c.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";
  return {
    id: c._id,
    title: c.title,
    brand: c.brand || "—",
    date: dateStr,
    location: c.location || "—",
    slots: c.slots ?? 0,
    description: c.description || "",
    categories: c.castingType ? [c.castingType] : [],
  };
}

const CASTING_CATEGORIES = ["All", "Bikini", "Commercial", "Editorial", "Bold", "Artistic Nude", "Glamour", "Fitness"];

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
      categories: c.categories,
    }))
  );
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);

  useEffect(() => {
    publicApi
      .castings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingRow));
      })
      .catch(() => {});
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(castings.map((c) => c.location).filter((l) => l && l !== "—"))).sort(),
    [castings]
  );

  const filtered = useMemo(() => {
    return castings.filter((c) => {
      if (categoryFilter !== "All" && !(c.categories || []).includes(categoryFilter)) return false;
      if (locationFilter !== "all" && c.location !== locationFilter) return false;
      if (urgentOnly && !c.urgent) return false;
      return true;
    });
  }, [castings, categoryFilter, locationFilter, urgentOnly]);

  const hasActiveFilters = categoryFilter !== "All" || locationFilter !== "all" || urgentOnly;

  const clearFilters = () => {
    setCategoryFilter("All");
    setLocationFilter("all");
    setUrgentOnly(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="mb-8">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Opportunities</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">Casting Calls</h1>
            <p className="text-muted-foreground font-body text-sm mt-4 max-w-lg">
              Browse the latest open casting calls from top brands and photographers worldwide.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8 bg-card magazine-border p-4">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Category pills */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {CASTING_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors ${
                        categoryFilter === cat
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-3 items-end">
              {/* Location */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Location</span>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="form-input py-1.5 text-xs min-w-[160px]"
                >
                  <option value="all">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Urgent toggle */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Status</span>
                <button
                  onClick={() => setUrgentOnly((v) => !v)}
                  className={`px-4 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors ${
                    urgentOnly
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Urgent Only
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-primary text-[11px] font-body tracking-wider uppercase hover:underline self-end pb-0.5 ml-auto"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <p className="text-muted-foreground text-[11px] font-body mt-3">
                Showing <span className="text-foreground font-medium">{filtered.length}</span> casting{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* List */}
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((casting, i) => (
              <motion.div
                key={casting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.3) }}
              >
                <Link
                  to={`/casting/${casting.id}`}
                  className="group flex flex-col md:flex-row md:items-stretch gap-0 bg-card magazine-border overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="w-full md:w-[220px] h-52 md:h-auto flex-shrink-0 overflow-hidden bg-muted">
                    {casting.image ? (
                      <img
                        src={imgSrc(casting.image)}
                        alt={casting.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-6 h-6 text-primary/50" />
                          </div>
                          <p className="text-muted-foreground font-body text-xs">Casting</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {casting.urgent && (
                          <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-2.5 py-0.5 tracking-[0.2em] uppercase">
                            Urgent
                          </span>
                        )}
                        {(casting.categories || []).map((cat) => (
                          <span key={cat} className="bg-secondary text-secondary-foreground text-[10px] font-body px-2.5 py-0.5 tracking-[0.15em] uppercase">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <p className="text-primary text-xs font-body tracking-wider mb-1">{casting.brand}</p>
                      <h3 className="font-display text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors mb-2">
                        {casting.title}
                      </h3>
                      <p className="text-muted-foreground text-xs font-body line-clamp-2">{casting.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-muted-foreground text-xs font-body">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {casting.date}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {casting.location}</span>
                      <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {casting.slots} slots</span>
                    </div>
                  </div>
                  <div className="hidden md:flex w-14 items-center justify-center border-l border-border/50 group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-body text-sm">No castings match your filters.</p>
              <button onClick={clearFilters} className="text-primary font-body text-xs mt-3 hover:underline">
                Clear filters
              </button>
            </div>
          )}

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
