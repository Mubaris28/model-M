"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicModel, type PublicCasting } from "@/lib/api";
import { Calendar, MapPin, ArrowRight, Users } from "lucide-react";
import { useState, useEffect } from "react";

type ModelCard = {
  id: string;
  name: string;
  image: string | { src: string };
  category: string;
  location: string;
  height: string;
};

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

function toModelCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    name: m.fullName || "Model",
    image: photo,
    category: m.categories?.[0] || "Model",
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    height: m.height || "—",
  };
}

function toCastingCard(c: PublicCasting): CastingCard {
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
    categories: c.castingType ? [c.castingType] : [],
  };
}

export default function PremiumPage() {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [castings, setCastings] = useState<CastingCard[]>([]);

  useEffect(() => {
    publicApi
      .models()
      .then((list) => {
        if (list?.length) setModels(list.map(toModelCard));
      })
      .catch(() => {});
    publicApi
      .castings()
      .then((list) => {
        if (list?.length) setCastings(list.map(toCastingCard));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Premium</p>
          <h1 className="font-display text-5xl md:text-6xl line-accent mb-12">Premium Models & Casting</h1>

          {/* Premium Models */}
          <section className="mb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <h2 className="font-display text-3xl md:text-4xl text-foreground">Premium Models</h2>
              <Link
                to="/models"
                className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors"
              >
                View All Models →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {models.length === 0 ? (
                <p className="col-span-full text-muted-foreground font-body text-sm">No premium models to show yet. Check back soon.</p>
              ) : (
                models.map((model) => (
                  <Link
                    key={model.id}
                    to={`/model/${model.id}`}
                    className="group relative block aspect-[3/4] min-h-[200px] overflow-hidden magazine-border hover:border-primary/30 transition-all"
                  >
                    <img
                      src={imgSrc(model.image)}
                      alt={model.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 cinematic-overlay pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="text-[10px] font-body tracking-[0.2em] uppercase text-primary">{model.category}</span>
                      <h3 className="font-display text-lg text-white mt-1">{model.name}</h3>
                      <p className="text-white/70 text-xs font-body mt-0.5">{model.location}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Casting */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <h2 className="font-display text-3xl md:text-4xl text-foreground">Casting</h2>
              <Link
                to="/casting"
                className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors"
              >
                View All Castings →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {castings.length === 0 ? (
                <p className="col-span-full text-muted-foreground font-body text-sm">No castings at the moment. Check back later.</p>
              ) : (
                castings.map((casting) => (
                  <Link
                    key={casting.id}
                    to={`/casting/${casting.id}`}
                    className="group flex flex-col bg-card magazine-border p-6 hover:border-primary/30 transition-all h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        {casting.urgent && (
                          <span className="bg-primary/10 text-primary text-[10px] font-body font-medium px-2.5 py-1 tracking-[0.2em] uppercase mb-2 inline-block">
                            Urgent
                          </span>
                        )}
                        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                          {casting.title}
                        </h3>
                        <p className="text-primary text-xs font-body mt-1 tracking-wider">{casting.brand}</p>
                      </div>
                      <div className="w-8 h-8 border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all flex-shrink-0 ml-4">
                        <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-muted-foreground text-xs font-body mb-4 mt-auto">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" /> {casting.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {casting.location}
                      </span>
                      {casting.slots > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" /> {casting.slots} slots
                        </span>
                      )}
                    </div>
                    {casting.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {casting.categories.map((cat) => (
                          <span
                            key={cat}
                            className="bg-secondary text-secondary-foreground text-[10px] font-body px-3 py-1 tracking-[0.15em] uppercase"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
