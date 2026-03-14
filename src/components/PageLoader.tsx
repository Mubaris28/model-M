"use client";

import { motion } from "framer-motion";

interface PageLoaderProps {
  label?: string;
}

export default function PageLoader({ label = "Loading..." }: PageLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-12 h-12 bg-primary flex items-center justify-center"
        >
          <span className="font-display text-2xl text-primary-foreground tracking-widest">M</span>
        </motion.div>

        {/* Bar loader */}
        <div className="w-48 h-[2px] bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
          />
        </div>

        {label && (
          <p className="text-muted-foreground font-body text-xs tracking-[0.3em] uppercase">
            {label}
          </p>
        )}
      </div>
    </motion.div>
  );
}
