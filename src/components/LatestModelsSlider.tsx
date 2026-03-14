"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/router-next";
import { imgSrc } from "@/lib/utils";
import { publicApi, type PublicModel } from "@/lib/api";

type SliderCard = {
  id: string;
  image: string | { src: string };
  category: string | null;
};

function toCard(m: PublicModel): SliderCard {
  const photo = m.profilePhoto || m.portfolio?.[0] || "";
  return {
    id: m._id,
    image: photo,
    category: m.categories?.[0] || null,
  };
}

export default function LatestModelsSlider() {
  const [cards, setCards] = useState<SliderCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let retries = 0;
    const MAX_RETRIES = 4;

    const load = () => {
      publicApi
        .sectionsLatest()
        .then((list) => {
          if (cancelled) return;
          if (!list?.length) {
            if (retries < MAX_RETRIES) { retries++; setTimeout(load, 1500 * retries); return; }
            setLoading(false);
            return;
          }
          setCards(list.map(toCard));
          setLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          if (retries < MAX_RETRIES) { retries++; setTimeout(load, 1500 * retries); }
          else setLoading(false);
        });
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // Always show the section heading; show skeleton cards while loading
  const duplicated = cards.length > 0 ? [...cards, ...cards] : [];

  return (
    <section className="bg-foreground text-background py-8 md:py-10 overflow-hidden" aria-label="Latest models">
      <div className="container mx-auto px-4 md:px-6 text-center mb-5 md:mb-6">
        <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-1">Discover</p>
        <h2 className="font-display text-3xl md:text-4xl text-primary-foreground uppercase">Latest Models</h2>
        <span className="block w-12 h-0.5 bg-primary mx-auto mt-2" aria-hidden="true" />
      </div>
      <div className="relative w-full -mx-4 md:-mx-6">
        {loading && (
          <div className="flex gap-3 md:gap-4 pl-4 md:pl-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[250px] sm:w-[300px]">
                <div className="aspect-[3/4] rounded-lg bg-white/5 animate-pulse" />
              </div>
            ))}
          </div>
        )}
        {!loading && duplicated.length > 0 && (
        <div className="latest-models-track flex gap-3 md:gap-4 w-max pl-4 md:pl-6">
          {duplicated.map((model, i) => (
            <Link
              key={`${model.id}-${i}`}
              to={`/model/${model.id}`}
              className="group flex-shrink-0 w-[250px] sm:w-[300px] md:w-[300px] block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-background/10">
                <img
                  src={imgSrc(model.image)}
                  alt=""
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                {model.category && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/85 to-transparent rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-display text-base md:text-lg lg:text-xl text-white block truncate">{model.category}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>
      <style>{`
        .latest-models-track {
          animation: latest-models-scroll 90s linear infinite;
        }
        .latest-models-track:hover {
          animation-play-state: paused;
        }
        @keyframes latest-models-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
