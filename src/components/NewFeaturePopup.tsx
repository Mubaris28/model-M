"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin } from "lucide-react";
import { Link } from "@/lib/router-next";
import { usePathname } from "next/navigation";
import { publicApi, type PublicModel, type PublicCasting } from "@/lib/api";

const POPUP_DISMISSED_KEY = "featured-popup-dismissed";
const POPUP_DELAY_MS = 2000;
const CASTING_POPUP_DELAY_MS = 4000;

type PopupPhase = "model" | "casting" | null;

export default function NewFeaturePopup() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<PopupPhase>(null);
  const [latestModel, setLatestModel] = useState<PublicModel | null>(null);
  const [latestCasting, setLatestCasting] = useState<PublicCasting | null>(null);
  const castingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(POPUP_DISMISSED_KEY)) return;
    if (pathname !== "/") return;

    const modelTimer = setTimeout(() => {
      Promise.all([publicApi.models(), publicApi.castings()])
        .then(([models, castings]) => {
          const model = models?.[0];
          const casting = castings?.[0];
          if (model) {
            setLatestModel(model);
            setPhase("model");
          }
          if (casting) setLatestCasting(casting);
        })
        .catch(() => {});
    }, POPUP_DELAY_MS);

    return () => {
      clearTimeout(modelTimer);
      if (castingTimerRef.current) clearTimeout(castingTimerRef.current);
    };
  }, [pathname]);

  const dismissModel = () => {
    setPhase(null);
    if (latestCasting) {
      castingTimerRef.current = setTimeout(() => setPhase("casting"), CASTING_POPUP_DELAY_MS);
    } else {
      try {
        sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
      } catch {
        // ignore
      }
    }
  };

  const dismissCasting = () => {
    setPhase(null);
    try {
      sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  };

  const dismissBackdrop = () => {
    if (phase === "model") dismissModel();
    else if (phase === "casting") dismissCasting();
  };

  const visible = phase !== null;
  const isModel = phase === "model" && latestModel;
  const isCasting = phase === "casting" && latestCasting;

  return (
    <AnimatePresence>
      {visible && (isModel || isCasting) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={dismissBackdrop}
            aria-hidden
          />
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            aria-hidden
          >
            <motion.div
              role="dialog"
              aria-labelledby={isModel ? "feature-popup-title" : "casting-popup-title"}
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={isModel ? dismissModel : dismissCasting}
                className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {isModel && (
                <>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {(() => {
                      const imageUrl = latestModel.profilePhoto || latestModel.portfolio?.[0];
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground font-body text-sm">
                          No image
                        </div>
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-body uppercase tracking-widest text-white/90">
                        New talent
                      </p>
                      <h2 id="feature-popup-title" className="font-display text-2xl text-white">
                        {latestModel.username || "New talent"}
                      </h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-muted-foreground text-sm font-body mb-4">
                      Meet our latest approved model. View profile and get in touch.
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/model/${latestModel._id}`}
                        onClick={dismissModel}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        View profile
                      </Link>
                      <button
                        type="button"
                        onClick={dismissModel}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </>
              )}

              {isCasting && latestCasting && (
                <>
                  <div className="p-6 pt-10">
                    <p className="text-xs font-body uppercase tracking-widest text-primary mb-1">
                      Latest casting
                    </p>
                    <h2 id="casting-popup-title" className="font-display text-2xl text-foreground mb-2">
                      {latestCasting.title}
                    </h2>
                    {(latestCasting.brand || latestCasting.date || latestCasting.location) && (
                      <div className="flex flex-wrap gap-3 text-muted-foreground text-xs font-body mb-3">
                        {latestCasting.brand && <span>{latestCasting.brand}</span>}
                        {latestCasting.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {latestCasting.date}
                          </span>
                        )}
                        {latestCasting.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {latestCasting.location}
                          </span>
                        )}
                      </div>
                    )}
                    {latestCasting.description && (
                      <p className="text-muted-foreground text-sm font-body mb-4 line-clamp-3">
                        {latestCasting.description}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm font-body mb-4">
                      Check out this opportunity and apply if you fit the brief.
                    </p>
                    <div className="flex gap-2">
                      <Link
                        to={`/casting/${latestCasting._id}`}
                        onClick={dismissCasting}
                        className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        View casting
                      </Link>
                      <button
                        type="button"
                        onClick={dismissCasting}
                        className="rounded-lg border border-border px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
