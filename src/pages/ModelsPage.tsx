import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { allModels } from "@/components/FeaturedModels";
import { categories } from "@/components/MagazineGrid";
import { Link } from "react-router-dom";
import { Heart, Filter, Grid, LayoutList, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_SHOW = 12;

const ModelsPage = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const models = useMemo(() => [...allModels, ...allModels, ...allModels], []);

  const locations = useMemo(() => Array.from(new Set(models.map((m) => m.location))).sort(), [models]);

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (locationFilter !== "all" && m.location !== locationFilter) return false;
      return true;
    });
  }, [models, categoryFilter, locationFilter]);

  const displayedModels = filteredModels.slice(0, showCount);
  const hasMore = filteredModels.length > showCount;

  const clearFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("all");
    setShowCount(INITIAL_SHOW);
  };

  const hasActiveFilters = categoryFilter !== "all" || locationFilter !== "all";

  useEffect(() => {
    document.title = "Professional Models Directory | Model Management Mauritius";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Browse 200+ verified professional models in Mauritius. Find fashion models, commercial models, runway models, and more. Connect directly with talented models for your projects.");
    return () => {
      document.title = "Model Management Mauritius - Professional Modeling Platform";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Discover</p>
              <h1 className="font-display text-6xl md:text-8xl line-accent">Models</h1>
              <p className="text-muted-foreground font-body text-sm mt-4 max-w-xl">
                Browse verified professional models. Find fashion, commercial, runway models and more. Connect directly with talent for your projects.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-body tracking-wider uppercase border transition-colors ${showFilters || hasActiveFilters ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/50"}`}
              >
                <Filter className="w-3 h-3" /> Filter
                {hasActiveFilters && <span className="bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">!</span>}
              </button>
              <button onClick={() => setView("grid")} className={`p-2 border ${view === "grid" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-2 border ${view === "list" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 md:p-6 bg-card magazine-border flex flex-wrap items-end gap-4"
            >
              <div className="w-full sm:w-auto min-w-[160px]">
                <label className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-auto min-w-[160px]">
                <label className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-primary text-xs font-body tracking-wider uppercase hover:underline">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </motion.div>
          )}

          <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" : "flex flex-col gap-4"}>
            {displayedModels.map((model, i) => (
              <motion.div
                key={`${model.id}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
              >
                {view === "grid" ? (
                  <Link to={`/model/${model.id}`} className="group block">
                    <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-3">
                      <img src={model.image} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-primary-foreground text-[9px] font-body tracking-[0.2em] uppercase px-2 py-0.5">{model.category}</span>
                      </div>
                    </div>
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                    <p className="text-muted-foreground text-[10px] font-body tracking-wider mt-1">{model.location} • {model.height}</p>
                  </Link>
                ) : (
                  <Link to={`/model/${model.id}`} className="group flex items-center gap-6 bg-card magazine-border p-4 hover:border-primary/30 transition-all">
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                      <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                      <p className="text-muted-foreground text-xs font-body mt-1">{model.category} • {model.location} • {model.height}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-body">
                      <Heart className="w-3 h-3" /> {model.likes.toLocaleString()}
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {hasMore && (
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
