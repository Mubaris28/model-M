"use client";

import { useState, useEffect } from "react";
import { Link } from "@/lib/router-next";
import CategoryCardsGrid from "@/components/CategoryCardsGrid";
import { publicApi } from "@/lib/api";

export type CategoryItem = { slug: string; name: string; description: string };

const MagazineGrid = () => {
  const [categories, setCategories] = useState<CategoryItem[] | null>(null);

  useEffect(() => {
    publicApi
      .categories()
      .then((data) => setCategories(data.categories?.length ? data.categories : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <section id="categories" className="py-14 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Browse by Category</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent text-primary">Categories</h2>
          </div>
          <Link to="/categories" className="text-primary text-xs font-body tracking-[0.15em] uppercase hover:text-red-light transition-colors hidden md:block">
            View All →
          </Link>
        </div>

        <CategoryCardsGrid categories={categories ?? []} />
      </div>
    </section>
  );
};

export default MagazineGrid;
