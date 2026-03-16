"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type AdSlide = {
  href?: string;
  imageDesktop: string;
  imageMobile?: string;
  alt: string;
};

const DEFAULT_ADS: AdSlide[] = [
  {
    imageDesktop: "/images/ad/main-ADS-web.png",
    imageMobile: "/images/ad/main-ADS-mobile.png",
    alt: "Model Management Indian Ocean — Advertise here",
  },
  {
    href: "https://bodyography.com",
    imageDesktop: "/images/ad/Bodyography-Web-ADS.png",
    imageMobile: "/images/ad/Bodyography-Mobile-ADS.png",
    alt: "Bodyography Professional Cosmetics — 30% off for ModelManagement.mu members",
  },
];

type AdSliderProps = {
  ads?: AdSlide[];
  autoAdvanceMs?: number;
};

export default function AdSlider({ ads = DEFAULT_ADS, autoAdvanceMs = 12000 }: AdSliderProps) {
  const [index, setIndex] = useState(0);
  const total = ads.length;

  useEffect(() => {
    if (total <= 1 || !autoAdvanceMs) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % total), autoAdvanceMs);
    return () => clearInterval(t);
  }, [total, autoAdvanceMs]);

  if (!total) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <section className="w-full overflow-hidden bg-muted/30">
      <div className="relative w-full">
        <div className="overflow-hidden bg-background" aria-label="Advertisement slider">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {ads.map((ad, i) => (
              <div key={i} className="w-full flex-shrink-0">
                {ad.href ? (
                    <a
                      href={ad.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <img
                        src={ad.imageMobile ?? ad.imageDesktop}
                        alt={ad.alt}
                        className="w-full h-auto object-contain object-center block md:hidden"
                      />
                      <img
                        src={ad.imageDesktop}
                        alt={ad.alt}
                        className="w-full h-auto object-contain object-center hidden md:block"
                      />
                    </a>
                  ) : (
                    <div className="block">
                      <img
                        src={ad.imageMobile ?? ad.imageDesktop}
                        alt={ad.alt}
                        className="w-full h-auto object-contain object-center block md:hidden"
                      />
                      <img
                        src={ad.imageDesktop}
                        alt={ad.alt}
                        className="w-full h-auto object-contain object-center hidden md:block"
                      />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>

        {total > 1 && (
          <div className="container mx-auto px-4 md:px-6 mt-4 pb-6 md:pb-8 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Previous ad"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Next ad"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
