"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEXT = "MODEL MANAGEMENT";
const MIN_DURATION_MS = 2200;
const FADE_OUT_MS = 500;

export default function AppLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const hide = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DURATION_MS - elapsed);
      setTimeout(() => {
        setVisible(false);
      }, delay);
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide);
      return () => window.removeEventListener("load", hide);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_MS / 1000, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[hsl(var(--dark-bg))] overflow-hidden"
          aria-hidden="true"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent opacity-80" />

          <div className="flex flex-col items-center justify-center gap-6 px-4">
            {/* Animated title: letter-by-letter */}
            <div className="flex flex-wrap justify-center gap-[0.02em] md:gap-[0.04em]">
              {TEXT.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 + i * 0.04,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="inline-block font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.08em] md:tracking-[0.12em] text-white uppercase"
                  style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.15)" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-[10px] sm:text-xs font-body tracking-[0.4em] uppercase text-white/50"
            >
              Mauritius
            </motion.p>

            {/* Progress line */}
            <motion.div
              className="h-0.5 w-32 bg-white/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-[hsl(var(--primary))] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
