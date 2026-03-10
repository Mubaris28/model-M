import { Megaphone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import catGlamour from "@/assets/cat-glamour.jpg";
import catCommercial from "@/assets/cat-commercial.jpg";
import catBikini from "@/assets/cat-bikini.jpg";

const cosmeticsAds = [
  {
    title: "LUXE Beauty Collection",
    subtitle: "New Season Essentials",
    description: "Discover the latest skincare & beauty products trusted by top models worldwide.",
    image: catGlamour,
    cta: "Shop Now",
  },
  {
    title: "AURA Skincare",
    subtitle: "Glow Like Never Before",
    description: "Professional-grade skincare used on editorial shoots and runways globally.",
    image: catCommercial,
    cta: "Explore",
  },
  {
    title: "NOVA Fragrance",
    subtitle: "Scent of Confidence",
    description: "The signature fragrance of the fashion industry. Bold, captivating, unforgettable.",
    image: catBikini,
    cta: "Discover",
  },
];

const AdBanner = ({ variant = "horizontal" }: { variant?: "horizontal" | "cosmetics" }) => {
  const [currentAd, setCurrentAd] = useState(0);

  if (variant === "cosmetics") {
    const ad = cosmeticsAds[currentAd];
    const prev = () => setCurrentAd((p) => (p - 1 + cosmeticsAds.length) % cosmeticsAds.length);
    const next = () => setCurrentAd((p) => (p + 1) % cosmeticsAds.length);

    return (
      <section className="relative h-[400px] md:h-[450px] overflow-hidden">
        <img src={typeof ad.image === "string" ? ad.image : (ad.image as { src: string }).src} alt={ad.title} className="w-full h-full object-cover transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-lg">
              <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-2">Sponsored • Cosmetics</p>
              <p className="text-white/60 font-body text-xs tracking-[0.3em] uppercase mb-3">{ad.subtitle}</p>
              <h3 className="font-display text-4xl md:text-6xl text-white mb-4">{ad.title}</h3>
              <p className="text-white/60 font-body text-sm mb-6 max-w-sm">{ad.description}</p>
              <button className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity group">
                {ad.cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        {/* Slider controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <button onClick={prev} className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {cosmeticsAds.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentAd(i)}
                className={`h-0.5 transition-all duration-500 ${i === currentAd ? "w-8 bg-primary" : "w-4 bg-white/30"}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="ad-banner p-5 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-red flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase font-body mb-1">Sponsored</p>
            <h3 className="font-display text-xl text-foreground">Premium Casting Opportunities Available</h3>
            <p className="text-muted-foreground text-xs font-body mt-1">
              Top brands seeking fresh talent. Register and get discovered by leading agencies.
            </p>
          </div>
        </div>
        <button className="bg-gradient-red text-primary-foreground px-6 py-2.5 text-xs font-body font-medium tracking-[0.15em] uppercase hover:opacity-90 transition-opacity whitespace-nowrap">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default AdBanner;
