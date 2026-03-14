import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import PageLoader from "@/components/PageLoader";
import { categories } from "@/components/MagazineGrid";
import { useParams, Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import BackButton from "@/components/BackButton";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { publicApi, type PublicModel } from "@/lib/api";

type ModelCard = { id: string; name: string; image: string | { src: string }; location: string; likes: number };

function toCard(m: PublicModel): ModelCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    name: m.fullName || "Model",
    image: photo,
    location: [m.city, m.country].filter(Boolean).join(", ") || "—",
    likes: 0,
  };
}

const CategoryDetail = () => {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);
  const [models, setModels] = useState<ModelCard[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!category) { setPageLoading(false); return; }
    setPageLoading(true);
    publicApi
      .models()
      .then((list) => {
        if (!list?.length) return setModels([]);
        const filtered = list.filter(
          (m) => m.categories?.some((cat) => cat?.toLowerCase() === category.name.toLowerCase())
        );
        setModels(filtered.map(toCard));
      })
      .catch(() => setModels([]))
      .finally(() => setPageLoading(false));
  }, [category]);

  if (pageLoading) return <PageLoader label={`Loading ${category?.name ?? ""}...`} />;

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="font-display text-6xl text-foreground">Category Not Found</h1>
          <BackButton label="Back to Categories" className="mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <BackButton label="Back to Categories" className="mb-6" />
          <h1 className="font-display text-6xl md:text-8xl line-accent">{category.name}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-primary text-xs font-body tracking-[0.3em] uppercase">{category.count} Models</span>
            <span className="text-muted-foreground text-xs font-body">{category.description}</span>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="container mx-auto px-4 md:px-6 py-12 categories-inner">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {models.length === 0 && (
            <p className="col-span-full text-muted-foreground font-body text-sm py-8">No models in this category yet.</p>
          )}
          {models.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link to={`/model/${model.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden magazine-border mb-3">
                  <img src={imgSrc(model.image)} alt={model.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors" />
                </div>
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">{model.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-body tracking-wider mt-1">
                  <span>{model.location}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="flex items-center gap-1"><Heart className="w-2.5 h-2.5" /> {model.likes}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <AdBanner />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryDetail;
