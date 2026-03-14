"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import AdBanner from "@/components/AdBanner";
import PageLoader from "@/components/PageLoader";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicModel } from "@/lib/api";
import { Heart, Grid, LayoutList, X } from "lucide-react";
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
  gender?: string;
  likes: number;
  country?: string;
  ethnicity?: string;
  hairColor?: string;
  eyeColor?: string;
  age?: number;
};

function toCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  const age = m.dateOfBirth ? new Date().getFullYear() - new Date(m.dateOfBirth).getFullYear() : undefined;
  return {
    id: m._id,
    name: m.username || m.fullName || "Model",
    image: photo,
    category: m.categories?.[0] || "Model",
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    height: m.height || "—",
    dressSize: m.dressSize,
    gender: m.gender,
    country: m.country,
    likes: 0,
    age,
  };
}

const DISCIPLINE_TABS = [
  "All", "Fashion", "Beauty", "Commercial", "Fitness", "Lingerie",
  "Runway", "Hair Model", "Parts Model", "Alternative/Artistic", "Catalog Model",
];

const CATEGORY_TABS = [
  "All", "Swimsuit Model", "Plus Size Model", "Glamour Model", "Mature Model",
  "Child Model", "Content Creator", "Petite", "Tall", "Tattoo-Body art", "Curve",
];

const GENDER_OPTIONS = ["All", "Female", "Male", "Non-binary"];

const ETHNICITY_OPTIONS = [
  "All", "African", "Afro-Caribbean", "Arab", "Asian", "Caucasian/White",
  "Creole", "East Asian", "European", "Hispanic/Latino", "Mauritian",
  "Mediterranean", "Mixed Race", "Other",
];

const HAIR_COLOR_OPTIONS = ["All", "Blonde", "Brown", "Black", "Red", "Auburn", "Gray", "White", "Silver", "Other"];
const EYE_COLOR_OPTIONS  = ["All", "Blue", "Brown", "Green", "Hazel", "Gray", "Amber", "Other"];

const EXPERIENCE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Beginner (0-1 years)", value: "Beginner (0-1 years)" },
  { label: "Intermediate (1-3 years)", value: "Intermediate (1-3 years)" },
  { label: "Experienced (3-5 years)", value: "Experienced (3-5 years)" },
  { label: "Professional (5+ years)", value: "Professional (5+ years)" },
];

const AGE_OPTIONS = [
  { label: "All", value: "All" },
  { label: "16-20", value: "16-20" },
  { label: "21-25", value: "21-25" },
  { label: "26-30", value: "26-30" },
  { label: "31-35", value: "31-35" },
  { label: "36-40", value: "36-40" },
  { label: "40+", value: "40+" },
];

function matchesAgeRange(age: number | undefined, range: string): boolean {
  if (range === "All" || !age) return true;
  if (range === "40+") return age >= 40;
  const [lo, hi] = range.split("-").map(Number);
  return age >= lo && age <= hi;
}

const ModelsPage = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [discipline, setDiscipline] = useState("All");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [ethnicity, setEthnicity] = useState("All");
  const [hairColor, setHairColor] = useState("All");
  const [eyeColor, setEyeColor] = useState("All");
  const [experience, setExperience] = useState("All");
  const [ageRange, setAgeRange] = useState("All");
  const [country, setCountry] = useState("All");
  const [showCount, setShowCount] = useState(INITIAL_SHOW);
  const [models, setModels] = useState<ModelCard[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    publicApi
      .models()
      .then((list) => {
        if (list?.length) setModels(list.map(toCard));
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, []);

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(models.map((m) => m.country).filter(Boolean))).sort()] as string[],
    [models]
  );

  const filteredModels = useMemo(() => {
    return models.filter((m) => {
      if (discipline !== "All" && m.category !== discipline) return false;
      if (category !== "All" && m.category !== category) return false;
      if (gender !== "All" && m.gender !== gender) return false;
      if (ethnicity !== "All" && (m as unknown as Record<string, string>).ethnicity !== ethnicity) return false;
      if (hairColor !== "All" && (m as unknown as Record<string, string>).hairColor !== hairColor) return false;
      if (eyeColor !== "All" && (m as unknown as Record<string, string>).eyeColor !== eyeColor) return false;
      if (experience !== "All" && (m as unknown as Record<string, string>).experience !== experience) return false;
      if (!matchesAgeRange(m.age, ageRange)) return false;
      if (country !== "All" && m.country !== country) return false;
      return true;
    });
  }, [models, discipline, category, gender, ethnicity, hairColor, eyeColor, experience, ageRange, country]);

  const displayedModels = filteredModels.slice(0, showCount);
  const hasMore = filteredModels.length > showCount;

  const clearFilters = () => {
    setDiscipline("All"); setCategory("All"); setGender("All");
    setEthnicity("All"); setHairColor("All"); setEyeColor("All");
    setExperience("All"); setAgeRange("All"); setCountry("All");
    setShowCount(INITIAL_SHOW);
  };

  const hasActiveFilters = discipline !== "All" || category !== "All" || gender !== "All" ||
    ethnicity !== "All" || hairColor !== "All" || eyeColor !== "All" ||
    experience !== "All" || ageRange !== "All" || country !== "All";

  if (pageLoading) return <PageLoader label="Loading models..." />;

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
              <button onClick={() => setView("grid")} className={`p-2.5 border transition-colors ${view === "grid" ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`} aria-label="Grid view">
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")} className={`p-2.5 border transition-colors ${view === "list" ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`} aria-label="List view">
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter panel */}
          <div className="mb-8 bg-card magazine-border p-4 space-y-4">
            {/* Row 1 — Discipline */}
            <div>
              <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Discipline</span>
              <div className="tabs-slider -mx-1 px-1 md:mx-0 md:px-0 gap-1.5 md:flex-wrap">
                {DISCIPLINE_TABS.map((d) => (
                  <button key={d} onClick={() => { setDiscipline(d); setShowCount(INITIAL_SHOW); }}
                    className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${discipline === d ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2 — Category */}
            <div>
              <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Category</span>
              <div className="tabs-slider -mx-1 px-1 md:mx-0 md:px-0 gap-1.5 md:flex-wrap">
                {CATEGORY_TABS.map((c) => (
                  <button key={c} onClick={() => { setCategory(c); setShowCount(INITIAL_SHOW); }}
                    className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${category === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3 — Dropdown filters */}
            <div className="flex flex-wrap gap-3 items-end pt-1">
              {/* Gender */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Gender</span>
                <select value={gender} onChange={(e) => { setGender(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[130px]">
                  {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Ethnicity */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Ethnicity</span>
                <select value={ethnicity} onChange={(e) => { setEthnicity(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[150px]">
                  {ETHNICITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Hair Color */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Hair Color</span>
                <select value={hairColor} onChange={(e) => { setHairColor(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[130px]">
                  {HAIR_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Eye Color */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Eye Color</span>
                <select value={eyeColor} onChange={(e) => { setEyeColor(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[120px]">
                  {EYE_COLOR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Experience */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Experience</span>
                <select value={experience} onChange={(e) => { setExperience(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[180px]">
                  {EXPERIENCE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Age</span>
                <select value={ageRange} onChange={(e) => { setAgeRange(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[110px]">
                  {AGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Country */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase">Country</span>
                <select value={country} onChange={(e) => { setCountry(e.target.value); setShowCount(INITIAL_SHOW); }} className="form-input py-1.5 text-xs min-w-[130px]">
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-primary text-[11px] font-body tracking-wider uppercase hover:underline self-end pb-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <p className="text-muted-foreground text-[11px] font-body">
              <span className="text-foreground font-medium">{filteredModels.length}</span> model{filteredModels.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* Grid (3 cols desktop) / List */}
          {filteredModels.length > 0 ? (
            <div className={view === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5"
              : "flex flex-col gap-4"
            }>
              {displayedModels.map((model, i) => (
                <motion.div key={`${model.id}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}>
                  {view === "grid" ? (
                    <Link to={`/model/${model.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-3">
                        <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-primary text-primary-foreground text-[9px] font-body tracking-[0.2em] uppercase px-2 py-0.5">{model.category}</span>
                        </div>
                      </div>
                      <h3 className="font-display text-base md:text-lg text-foreground group-hover:text-primary transition-colors leading-tight">{model.name}</h3>
                      <p className="text-muted-foreground text-[10px] font-body tracking-wider mt-1">{model.location} · {model.height}</p>
                    </Link>
                  ) : (
                    <Link to={`/model/${model.id}`} className="group flex items-center gap-5 bg-card magazine-border p-4 hover:border-primary/30 transition-all">
                      <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                        <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                        <p className="text-muted-foreground text-xs font-body mt-0.5">{model.category} · {model.location} · {model.height}</p>
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
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-body text-sm">
                {hasActiveFilters ? "No models match your current filters. Try adjusting your search criteria." : "No models found. Check back soon."}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-primary font-body text-xs mt-3 hover:underline">Clear filters</button>
              )}
            </div>
          )}

          {hasMore && (
            <div className="mt-12 text-center">
              <button onClick={() => setShowCount((n) => n + INITIAL_SHOW)} className="bg-secondary text-secondary-foreground px-8 py-3 text-xs font-body tracking-[0.2em] uppercase hover:bg-secondary/80 transition-colors">
                Show more
              </button>
            </div>
          )}

          <div className="mt-12"><AdBanner /></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ModelsPage;
