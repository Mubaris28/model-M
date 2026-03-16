"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { motion } from "framer-motion";
import { publicApi } from "@/lib/api";

type Cat = { name: string; slug: string; description: string; count?: number };

function getFirstModelImage(first: { profilePhoto?: unknown; portfolio?: unknown[] } | null): string {
  if (!first) return "";
  const photo = first.profilePhoto || (Array.isArray(first.portfolio) && first.portfolio?.[0]) || "";
  return typeof photo === "string" ? photo : (photo as { src?: string })?.src || "";
}

export default function CategoryCardsGrid({ categories = [] }: { categories?: Cat[] }) {
  const [imageBySlug, setImageBySlug] = useState<Record<string, string>>({});
  const [countBySlug, setCountBySlug] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      const nextImg: Record<string, string> = {};
      const nextCount: Record<string, number> = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const models = await publicApi.categoryModels(cat.slug);
            nextCount[cat.slug] = Array.isArray(models) ? models.length : 0;
            const first = models?.[0];
            const img = getFirstModelImage(first ?? null);
            if (img) nextImg[cat.slug] = img;
          } catch {
            // no fallback: card image from API only
          }
        })
      );
      setImageBySlug((prev) => ({ ...prev, ...nextImg }));
      setCountBySlug((prev) => ({ ...prev, ...nextCount }));
    };
    load();
  }, [categories]);

  return (
    <div className="mobile-slider gap-4 md:gap-6" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
      {categories.map((cat, i) => {
        const cardImage = imageBySlug[cat.slug];
        const modelCount = countBySlug[cat.slug] ?? cat.count ?? 0;
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link to={`/category/${cat.slug}`} className="group relative block aspect-[4/5] min-h-[320px] md:min-h-[380px] overflow-hidden magazine-border bg-muted">
              {cardImage ? (
                <img
                  src={imgSrc(cardImage)}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-body">
                  No image
                </div>
              )}
              <div className="absolute inset-0 cinematic-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-2 py-0.5 mb-2 inline-block">
                  {modelCount} Models
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-white">{cat.name}</h3>
                <p className="text-white/60 text-xs font-body mt-1">{cat.description}</p>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                <ArrowUpRight className="w-3 h-3 text-white/60 group-hover:text-primary-foreground transition-colors" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
