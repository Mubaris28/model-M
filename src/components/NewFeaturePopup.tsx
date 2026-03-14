"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "@/lib/router-next";
import { usePathname } from "next/navigation";
import { publicApi, type PublicModel } from "@/lib/api";

const POPUP_DISMISSED_KEY = "featured-popup-dismissed";
const POPUP_DELAY_MS = 2000;

export default function NewFeaturePopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [feature, setFeature] = useState<PublicModel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(POPUP_DISMISSED_KEY)) return;
    if (pathname !== "/") return;

    const timer = setTimeout(() => {
      publicApi
        .models()
        .then((list) => {
          const latest = list?.[0];
          if (latest) {
            setFeature(latest);
            setVisible(true);
          }
        })
        .catch(() => {});
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(POPUP_DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!feature) return null;

  const imageUrl = feature.profilePhoto || feature.portfolio?.[0];
  const name = feature.fullName || "New talent";

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden
          />
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            aria-hidden
          >
            <motion.div
              role="dialog"
              aria-labelledby="feature-popup-title"
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
              onClick={dismiss}
              className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground font-body text-sm">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-body uppercase tracking-widest text-white/90">
                  New talent
                </p>
                <h2 id="feature-popup-title" className="font-display text-2xl text-white">
                  {name}
                </h2>
              </div>
            </div>

            <div className="p-4">
              <p className="text-muted-foreground text-sm font-body mb-4">
                Meet our latest approved model. View profile and get in touch.
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/model/${feature._id}`}
                  onClick={dismiss}
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  View profile
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-body text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  Dismiss
                </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
