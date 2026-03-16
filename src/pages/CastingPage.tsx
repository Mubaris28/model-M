"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import AdBanner from "@/components/AdBanner";
import PageLoader from "@/components/PageLoader";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { Calendar, MapPin, Users, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { publicApi, type PublicCasting } from "@/lib/api";
import { FilterSelect } from "@/components/FilterSelect";

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
  price?: string;
  gender?: string;
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
    image: c.imageUrls?.[0] || "",
    categories: c.castingType ? [c.castingType] : [],
    price: c.price,
    gender: (c as unknown as { gender?: string }).gender,
  };
}

const CASTING_TYPES = ["All", "Paid Shoot", "Collaborative Shoot", "Content Creation"];
const GENDER_OPTIONS = ["All", "Female", "Male", "Non-binary", "Any"];
const PAYMENT_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Paid Only", value: "paid" },
  { label: "Unpaid/TFP", value: "unpaid" },
];

const CastingPage = () => {
  const [castings, setCastings] = useState<CastingRow[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [castingTypeFilter, setCastingTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .castings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingRow));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(castings.map((c) => c.location).filter((l) => l && l !== "—"))).sort(),
    [castings]
  );

  const filtered = useMemo(() => {
    return castings.filter((c) => {
      if (categoryFilter !== "All" && !(c.categories || []).includes(categoryFilter)) return false;
      if (castingTypeFilter !== "All" && castingTypeFilter !== (c.categories?.[0] || "")) return false;
      if (locationFilter !== "all" && c.location !== locationFilter) return false;
      if (genderFilter !== "All" && genderFilter !== "Any") {
        if (!c.gender || c.gender !== genderFilter) return false;
      }
      if (paymentFilter === "paid") {
        const price = c.price;
        if (!price || String(price).trim() === "" || price === "0" || /^TFP|Unpaid|Free$/i.test(String(price))) return false;
      }
      if (paymentFilter === "unpaid") {
        const price = c.price;
        if (price && String(price).trim() !== "" && price !== "0" && !/^TFP|Unpaid|Free$/i.test(String(price))) return false;
      }
      return true;
    });
  }, [castings, categoryFilter, castingTypeFilter, locationFilter, genderFilter, paymentFilter]);

  const hasActiveFilters = categoryFilter !== "All" || castingTypeFilter !== "All" || locationFilter !== "all" || genderFilter !== "All" || paymentFilter !== "All";

  const clearFilters = () => {
    setCategoryFilter("All");
    setCastingTypeFilter("All");
    setLocationFilter("all");
    setGenderFilter("All");
    setPaymentFilter("All");
  };

  if (loading) return <PageLoader label="Loading castings..." />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">

          <BackButton className="mb-6" />

          {/* Header */}
          <div className="mb-8">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Opportunities</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">Casting Calls</h1>
            <p className="text-muted-foreground font-body text-sm mt-4 max-w-lg">
              Browse the latest open casting calls from top brands and photographers worldwide.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-8 bg-card magazine-border p-4 space-y-4">
            {/* Casting Type tabs */}
            <div>
              <span className="text-[10px] text-muted-foreground font-body tracking-[0.2em] uppercase block mb-2">Casting Type</span>
              <div className="tabs-slider gap-1.5 -mx-1 px-1 md:mx-0 md:px-0 md:flex-wrap">
                {CASTING_TYPES.map((t) => (
                  <button key={t} onClick={() => setCastingTypeFilter(t)}
                    className={`px-3 py-1.5 text-[11px] font-body tracking-wider uppercase border transition-colors shrink-0 ${
                      castingTypeFilter === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdown filters */}
            <div className="flex flex-wrap gap-3 items-end">
              <FilterSelect label="Gender" value={genderFilter} onValueChange={setGenderFilter} options={GENDER_OPTIONS} minWidth="130px" />
              <FilterSelect label="Location" value={locationFilter} onValueChange={setLocationFilter} options={["all", ...locations]} optionLabels={{ all: "All locations" }} placeholder="All locations" minWidth="150px" />
              <FilterSelect label="Payment" value={paymentFilter} onValueChange={setPaymentFilter} options={PAYMENT_OPTIONS.map((o) => o.value)} optionLabels={PAYMENT_OPTIONS.reduce((acc, o) => ({ ...acc, [o.value]: o.label }), {} as Record<string, string>)} minWidth="130px" />
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

          {/* Casting cards — natural heights, no border or content bg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
            {filtered.map((casting, i) => (
              <motion.div
                key={casting.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.35) }}
              >
                <Link
                  to={`/casting/${casting.id}`}
                  className="group flex flex-col overflow-hidden transition-opacity hover:opacity-95"
                >
                  {/* Image — natural size, different height per card ok */}
                  {casting.image ? (
                    <div className="w-full overflow-hidden bg-muted relative">
                      <img
                        src={imgSrc(casting.image)}
                        alt={casting.title}
                        className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                        style={{ display: "block", maxHeight: "520px", objectFit: "cover", width: "100%" }}
                      />
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {casting.urgent && (
                          <span className="bg-primary text-primary-foreground text-[10px] font-body font-semibold px-2.5 py-1 tracking-[0.18em] uppercase shadow-sm">
                            Urgent
                          </span>
                        )}
                        {(casting.categories || []).map((cat) => (
                          <span key={cat} className="bg-black/70 text-white text-[10px] font-body px-2.5 py-1 tracking-[0.15em] uppercase">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-56 bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-14 h-14 bg-primary/10 flex items-center justify-center mx-auto mb-2">
                          <Users className="w-7 h-7 text-primary/40" />
                        </div>
                        <p className="text-muted-foreground font-body text-xs tracking-wider uppercase">Casting Call</p>
                      </div>
                    </div>
                  )}

                  {/* Content — no border, no card bg; blends with page */}
                  <div className="flex flex-col pt-4 pb-1 gap-3">
                    <div>
                      <p className="text-primary text-[11px] font-body tracking-[0.25em] uppercase mb-1">{casting.brand}</p>
                      <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-tight uppercase">
                        {casting.title}
                      </h3>
                    </div>
                    {casting.description && (
                      <p className="text-muted-foreground text-xs font-body leading-relaxed line-clamp-2">
                        {casting.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-muted-foreground text-[11px] font-body">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                        {casting.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                        {casting.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 shrink-0 text-primary/60" />
                        {casting.slots} Models
                      </span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-primary text-[11px] font-body tracking-[0.18em] uppercase font-medium group-hover:gap-2.5 transition-all">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
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
