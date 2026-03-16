"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/PageLoader";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicMarketplaceItem } from "@/lib/api";
import { ArrowUpRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { FilterSelect } from "@/components/FilterSelect";

const CATEGORY_TABS = ["All", "Photography", "Styling", "Training", "Digital", "Makeup", "Other"];
const AVAILABILITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

const MarketplacePage = () => {
  const [items, setItems] = useState<PublicMarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState<"all" | "available" | "unavailable">("all");
  const [location, setLocation] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    publicApi
      .marketplace()
      .then((list) => {
        if (list?.length) setItems(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.location).filter(Boolean))).sort()] as string[],
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (location !== "All" && item.location !== location) return false;
      if (availability === "available" && item.available === false) return false;
      if (availability === "unavailable" && item.available !== false) return false;
      const price = item.price ?? 0;
      if (price < priceRange[0] || price > priceRange[1]) return false;
      return true;
    });
  }, [items, category, location, availability, priceRange]);

  const hasActiveFilters = category !== "All" || location !== "All" || availability !== "all";

  const clearFilters = () => {
    setCategory("All");
    setLocation("All");
    setAvailability("all");
    setPriceRange([0, 10000]);
  };

  if (loading) return <PageLoader label="Loading marketplace..." />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="dark-section py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex justify-start mb-4"><BackButton className="text-white/60 hover:text-white" /></div>
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Curated Offers</p>
          <h1 className="font-display text-6xl md:text-8xl text-white mb-4">Marketplace</h1>
          <p className="text-white/50 font-body text-sm max-w-md mx-auto">
            Discover exclusive services and products from industry professionals.
          </p>
        </div>
      </div>

      <div className="pt-10 pb-16">
        <div className="container mx-auto px-4 md:px-6">

          {/* Filters */}
          <div className="mb-8 bg-card magazine-border p-4 space-y-4">
            {/* Category tabs */}
            <div>
              <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Category</span>
              <div className="tabs-slider -mx-1 px-1 md:mx-0 md:px-0 gap-1.5 md:flex-wrap">
                {CATEGORY_TABS.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${
                      category === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdowns */}
            <div className="flex flex-wrap gap-3 items-end">
              <FilterSelect label="Location" value={location} onValueChange={(v) => setLocation(v)} options={locations} minWidth="140px" />
              <FilterSelect label="Availability" value={availability} onValueChange={(v) => setAvailability(v as "all" | "available" | "unavailable")} options={AVAILABILITY_OPTIONS.map((o) => o.value)} optionLabels={AVAILABILITY_OPTIONS.reduce((acc, o) => ({ ...acc, [o.value]: o.label }), {} as Record<string, string>)} minWidth="140px" />
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-primary text-[11px] font-body tracking-wider uppercase hover:underline self-end pb-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <p className="text-muted-foreground text-[11px] font-body">
              <span className="text-foreground font-medium">{filtered.length}</span> item{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-display text-4xl text-muted-foreground/30 mb-4">No items yet</p>
              <p className="text-muted-foreground font-body text-sm">
                {hasActiveFilters
                  ? "No marketplace items match your filters."
                  : "Marketplace listings will appear here once professionals add their services."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-primary font-body text-xs mt-4 hover:underline">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((item, i) => (
                <motion.div key={item._id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <Link to={`/marketplace/${item._id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-0">
                      {item.image ? (
                        <img src={imgSrc(item.image)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground font-body text-xs">{item.category || "Service"}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 cinematic-overlay" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-[9px] font-body tracking-[0.2em] uppercase px-2.5 py-1">
                          {item.category || "Service"}
                        </span>
                      </div>
                      {item.price != null && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-background text-foreground text-xs font-body font-medium tracking-wider px-3 py-1">
                            {item.currency || ""}{item.price}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 w-9 h-9 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <div className="pt-3">
                      <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.location && <p className="text-muted-foreground text-[10px] font-body tracking-wider mt-1">{item.location}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
