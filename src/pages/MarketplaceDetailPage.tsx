"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import PageLoader from "@/components/PageLoader";
import { useParams } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicMarketplaceItem } from "@/lib/api";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const MarketplaceDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState<PublicMarketplaceItem | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    publicApi
      .marketplaceItem(id)
      .then((data) => setItem(data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader label="Loading..." />;

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 md:px-6 text-center">
          <h1 className="font-display text-4xl text-foreground mb-4">Offer not found</h1>
          <BackButton label="Back to Marketplace" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <BackButton label="Back to Marketplace" className="mb-8" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-[4/5] overflow-hidden magazine-border bg-muted">
              {item.image ? (
                <img src={imgSrc(item.image)} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground font-body text-sm">{item.category || "Service"}</span>
                </div>
              )}
            </div>
            <div>
              {item.price != null && (
                <span className="bg-primary text-primary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">
                  {item.currency || ""}{item.price}
                </span>
              )}
              {item.category && (
                <span className="ml-2 bg-secondary text-secondary-foreground text-[10px] font-body tracking-[0.2em] uppercase px-3 py-1">
                  {item.category}
                </span>
              )}
              <h1 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-6">{item.title}</h1>
              {item.location && <p className="text-muted-foreground font-body text-xs tracking-wider mb-4">{item.location}</p>}
              {item.description && (
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">{item.description}</p>
              )}
              {item.available === false && (
                <p className="text-destructive font-body text-xs mb-4">Currently unavailable</p>
              )}
              <button
                disabled={item.available === false}
                className="bg-primary text-primary-foreground px-8 py-3 font-body text-sm tracking-[0.15em] uppercase hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.available === false ? "Unavailable" : "Book This Offer"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketplaceDetailPage;
