"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MIN_DURATION_MS = 2200;
const FADE_OUT_MS = 400;
const SESSION_KEY = "mm_intro_shown";

export default function AppLoader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) return;

    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");

    const start = Date.now();
    const hide = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DURATION_MS - elapsed);
      setTimeout(() => setVisible(false), delay);
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
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 px-4">
            {/* Line 1: MODEL */}
            <div className="flex justify-center gap-[0.08em] md:gap-[0.12em]">
              {"MODEL".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.06 + i * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="inline-block font-display text-5xl sm:text-6xl md:text-7xl tracking-[0.12em] md:tracking-[0.16em] text-white uppercase font-medium"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Line 2: INDIAN OCEAN */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="text-[11px] sm:text-xs font-body tracking-[0.4em] sm:tracking-[0.5em] uppercase text-white/70"
            >
              Indian Ocean
            </motion.p>

            {/* Line 3: MODEL MANAGEMENT */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.55, ease: "easeOut" }}
              className="text-[11px] sm:text-xs font-body tracking-[0.35em] uppercase text-white/60"
            >
              Model Management
            </motion.p>

            {/* Progress bar: subtle, no underline */}
            <motion.div
              className="h-[2px] w-28 sm:w-32 bg-white/10 rounded-full overflow-hidden mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <motion.div
                className="h-full bg-white/40 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, delay: 0.2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
