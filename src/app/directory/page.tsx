"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/PageLoader";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicModel } from "@/lib/api";
import { useState, useEffect } from "react";

type ModelCard = {
  id: string;
  name: string;
  image: string | { src: string };
  category: string;
  location: string;
  height: string;
};

function toModelCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    name: m.username || m.fullName || "Model",
    image: photo,
    category: m.categories?.[0] || "Model",
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    height: m.height || "—",
  };
}

export default function PremiumPage() {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .models()
      .then((list) => {
        if (list?.length) setModels(list.map(toModelCard));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader label="Loading premium models..." />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />

          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Premium</p>
          <h1 className="font-display text-5xl md:text-6xl line-accent mb-12">Premium Models</h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Featured Talent</h2>
            <Link to="/models" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors">
              View All Models →
            </Link>
          </div>

          {/* 3-col grid */}
          {models.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm py-12">No premium models to show yet. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {models.map((model) => (
                <Link
                  key={model.id}
                  to={`/model/${model.id}`}
                  className="group relative block aspect-[3/4] overflow-hidden magazine-border hover:border-primary/30 transition-all"
                >
                  <img
                    src={imgSrc(model.image)}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 cinematic-overlay pointer-events-none" />
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[9px] font-body font-bold tracking-[0.2em] uppercase px-2 py-0.5 flex items-center gap-1">
                    ★ Premium
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-[10px] font-body tracking-[0.2em] uppercase text-primary">{model.category}</span>
                    <h3 className="font-display text-lg text-white mt-1">{model.name}</h3>
                    <p className="text-white/70 text-xs font-body mt-0.5">{model.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
