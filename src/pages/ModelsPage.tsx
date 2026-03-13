"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import AdBanner from "@/components/AdBanner";
import { categories } from "@/components/MagazineGrid";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicModel } from "@/lib/api";
import { Heart, Grid, LayoutList, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

const INITIAL_SHOW = 12;

type ModelCard = {
  id: string;
  name: string;
  image: string | { src: string };
  category: string;
  location: string;
  height: string;
  dressSize?: string;
  likes: number;
};

function toCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    name: m.fullName || "Model",
    image: photo,
    category: m.categories?.[0] || "Model",
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    height: m.height || "—",
    dressSize: m.dressSize,
    likes: 0,
  };
}

const HEIGHT_OPTIONS = [
  { label: "All Heights", value: "all" },
  { label: "Under 5'5\" (165cm)", value: "Under 5'5\" (under 165 cm)" },
  { label: "5'5\"–5'7\" (165–170cm)", value: "5'5\"–5'7\" (165–170 cm)" },
  { label: "5'8\"–5'10\" (173–178cm)", value: "5'8\"–5'10\" (173–178 cm)" },
  { label: "5'11\"–6'1\" (180–185cm)", value: "5'11\"–6'1\" (180–185 cm)" },
  { label: "6'2\"+ (188cm+)", value: "6'2\" and over (188+ cm)" },
];

const SIZE_OPTIONS = [
  { label: "All Sizes", value: "all" },
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "XXL", value: "XXL" },
];

const ModelsPage = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [heightFilter, setHeightFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [models, setModels] = useState<ModelCard[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);

  useEffect(() => {
    setModelsLoading(true);
    publicApi
      .models()
      .then((list) => {
        if (list?.length) setModels(list.map(toCard));
      })
      .catch(() => {})
      .finally(() => setModelsLoading(false));
  }, []);

  const locations = useMemo(() => Array.from(new Set(models.map((m) => m.location))).sort(), [models]);

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (locationFilter !== "all" && m.location !== locationFilter) return false;
      if (heightFilter !== "all" && m.height !== heightFilter) return false;
      if (sizeFilter !== "all" && m.dressSize !== sizeFilter) return false;
      return true;
    });
  }, [models, categoryFilter, locationFilter, heightFilter, sizeFilter]);

  const displayedModels = filteredModels.slice(0, showCount);
  const hasMore = filteredModels.length > showCount;

  const clearFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("all");
    setHeightFilter("all");
    setSizeFilter("all");
    setShowCount(INITIAL_SHOW);
  };

  const hasActiveFilters =
    categoryFilter !== "all" || locationFilter !== "all" || heightFilter !== "all" || sizeFilter !== "all";

  useEffect(() => {
    document.title = "Professional Models Directory | Model Management Mauritius";
    return () => {
      document.title = "Model Management Mauritius - Professional Modeling Platform";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">

          <BackButton className="mb-6" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Discover</p>
              <h1 className="font-display text-6xl md:text-8xl line-accent">Models</h1>
              <p className="text-muted-foreground font-body text-sm mt-4 max-w-xl">
                Browse verified professional models. Connect directly with talent for your projects.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2.5 border transition-colors ${view === "grid" ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2.5 border transition-colors ${view === "list" ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Bar — always visible; category pills scroll on mobile */}
          <div className="mb-8 bg-card magazine-border p-4">
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-1.5">Category</span>
                <div className="tabs-slider gap-1.5 -mx-1 px-1 md:mx-0 md:px-0 md:flex-wrap">
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${
                      categoryFilter === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCategoryFilter(c.name)}
                      className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${
                        categoryFilter === c.name ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {c.name}
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
                  className="form-input py-1.5 text-xs min-w-[140px]"
                >
                  <option value="all">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Height */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Height</span>
                <select
                  value={heightFilter}
                  onChange={(e) => setHeightFilter(e.target.value)}
                  className="form-input py-1.5 text-xs min-w-[160px]"
                >
                  {HEIGHT_OPTIONS.map((h) => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>

              {/* Dress Size */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Size</span>
                <div className="flex flex-wrap gap-1.5">
                  {SIZE_OPTIONS.map((sz) => (
                    <button
                      key={sz.value}
                      onClick={() => setSizeFilter(sz.value)}
                      className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors ${
                        sizeFilter === sz.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-primary text-[11px] font-body tracking-wider uppercase hover:underline ml-auto self-end pb-0.5"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <p className="text-muted-foreground text-[11px] font-body mt-3">
                Showing <span className="text-foreground font-medium">{filteredModels.length}</span> result{filteredModels.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Loading */}
          {modelsLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground font-body text-sm">Loading models...</span>
            </div>
          )}

          {/* Grid / List */}
          {!modelsLoading && filteredModels.length > 0 && (
            <div className={view === "grid" ? "mobile-slider gap-4 md:gap-5" : "flex flex-col gap-4"}>
              {displayedModels.map((model, i) => (
                <motion.div
                  key={`${model.id}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                >
                  {view === "grid" ? (
                    <Link to={`/model/${model.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-3">
                        <img
                          src={imgSrc(model.image)}
                          alt={model.name}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary text-primary-foreground text-[9px] font-body tracking-[0.2em] uppercase px-2 py-0.5">
                            {model.category}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-display text-base md:text-lg text-foreground group-hover:text-primary transition-colors leading-tight">
                        {model.name}
                      </h3>
                      <p className="text-muted-foreground text-[10px] font-body tracking-wider mt-1">
                        {model.location} · {model.height}
                      </p>
                    </Link>
                  ) : (
                    <Link
                      to={`/model/${model.id}`}
                      className="group flex items-center gap-5 bg-card magazine-border p-4 hover:border-primary/30 transition-all"
                    >
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                        <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-muted-foreground text-xs font-body mt-0.5">
                          {model.category} · {model.location} · {model.height}
                        </p>
                      </div>
                      {model.likes > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground text-xs font-body flex-shrink-0">
                          <Heart className="w-3 h-3" /> {model.likes.toLocaleString()}
                        </div>
                      )}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {!modelsLoading && filteredModels.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-body text-sm">
                {hasActiveFilters ? "No models match your filters." : "No models found. Check back soon."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-primary font-body text-xs mt-3 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!modelsLoading && hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => setShowCount((n) => n + INITIAL_SHOW)}
                className="bg-secondary text-secondary-foreground px-8 py-3 text-xs font-body tracking-[0.2em] uppercase hover:bg-secondary/80 transition-colors"
              >
                Show more
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

export default ModelsPage;
