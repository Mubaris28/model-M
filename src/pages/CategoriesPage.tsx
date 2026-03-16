"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { publicApi } from "@/lib/api";

type CategoryItem = { slug: string; name: string; description: string };

function getFirstModelImage(first: { profilePhoto?: unknown; portfolio?: unknown[] } | null): string {
  if (!first) return "";
  const photo = first.profilePhoto || (Array.isArray(first.portfolio) && first.portfolio?.[0]) || "";
  return typeof photo === "string" ? photo : (photo as { src?: string })?.src || "";
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [imageBySlug, setImageBySlug] = useState<Record<string, string>>({});
  const [countBySlug, setCountBySlug] = useState<Record<string, number>>({});

  useEffect(() => {
    publicApi.categories().then((data) => setCategories(data.categories ?? [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    const load = async () => {
      const nextImg: Record<string, string> = {};
      const nextCount: Record<string, number> = {};
      await Promise.all(
        categories.map(async (cat) => {
          try {
            const models = await publicApi.categoryModels(cat.slug);
            nextCount[cat.slug] = Array.isArray(models) ? models.length : 0;
            const img = getFirstModelImage(models?.[0] ?? null);
            if (img) nextImg[cat.slug] = img;
          } catch {
            // no static fallback
          }
        })
      );
      setImageBySlug((prev) => ({ ...prev, ...nextImg }));
      setCountBySlug((prev) => ({ ...prev, ...nextCount }));
    };
    load();
  }, [categories]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton className="mb-6" />
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Browse</p>
            <h1 className="font-display text-6xl md:text-8xl line-accent">All Categories</h1>
            <p className="text-muted-foreground font-body text-sm mt-6 max-w-lg">
              Explore our complete collection of model categories. From editorial to fitness, find the perfect talent for your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const cardImage = imageBySlug[cat.slug];
              const modelCount = countBySlug[cat.slug] ?? cat.count;
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link to={`/category/${cat.slug}`} className="group relative block aspect-square overflow-hidden magazine-border bg-muted">
                    {cardImage ? (
                      <img src={imgSrc(cardImage)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-body">No image</div>
                    )}
                    <div className="absolute inset-0 cinematic-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-primary text-[10px] font-body tracking-[0.3em] uppercase">{modelCount} Models</span>
                      <h2 className="font-display text-4xl text-white">{cat.name}</h2>
                      <p className="text-white/80 text-sm font-body mt-1">{cat.description}</p>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                      <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-primary-foreground" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
