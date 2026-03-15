"use client";

import { useState } from "react";
import { Link } from "@/lib/router-next";
import { ArrowRight, Play, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMG = "/images/hero/hero-model.jpg";

export default function HeroSingle() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[100dvh] h-[100dvh] max-h-[100dvh] md:min-h-[70vh] md:h-screen md:max-h-[100dvh] overflow-hidden bg-foreground">
      <img
        src={HERO_IMG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
      <div className="absolute inset-0 cinematic-overlay-left" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full min-h-0 flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 pt-20 sm:pt-24 md:pt-32 lg:pt-32 xl:pt-36 pb-6 sm:pb-8 md:pb-10 lg:pb-8 xl:pb-10">
        <div className="max-w-3xl w-full shrink-0 flex flex-col gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <img
            src="/images/hero-logo/modelmanagement-logo.png"
            alt="Model Management"
            className="block w-[110px] sm:w-[140px] md:w-[200px] lg:w-[220px] h-auto object-contain shrink-0"
          />
          <p className="text-primary font-body text-[9px] sm:text-[10px] md:text-xs tracking-[0.4em] sm:tracking-[0.5em] uppercase shrink-0">
            Model Management
          </p>
          <h1 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-[0.9] text-white uppercase shrink-0">
            <span className="block">One Platform</span>
            <span className="block">for all</span>
            <span className="block">models</span>
          </h1>
          <p className="text-white/90 font-body text-[11px] sm:text-xs md:text-base lg:text-lg tracking-wide shrink-0">
            Single account for your modeling journey
          </p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
            <Link
              to="/modelsTalents"
              className="inline-flex items-center gap-1 sm:gap-2 md:gap-3 bg-gradient-red text-primary-foreground px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-body font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-[10px] sm:text-xs md:text-sm hover:opacity-90 transition-opacity group"
            >
              Models
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/professionals"
              className="inline-flex items-center gap-1 sm:gap-2 md:gap-3 border-2 border-white text-white px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-body font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-[10px] sm:text-xs md:text-sm hover:border-primary hover:text-primary transition-all group"
            >
              Professionals
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/event"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-3 py-2 sm:px-5 sm:py-3 font-body font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-[10px] sm:text-xs hover:bg-white/20 hover:border-white/50 transition-all"
              aria-label="Casting Event 18 April 2026, Labourdonnais Waterfront Hotel – View details"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>Casting Event</span>
              <span className="text-white/80 font-normal">18 Apr</span>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex flex-shrink-0 items-center justify-end w-[220px] xl:w-[260px] 2xl:w-[280px]">
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="group relative block w-full aspect-[9/16] rounded-sm border-2 border-white/50 bg-black/40 overflow-hidden hover:border-white/80 hover:bg-black/50 transition-all"
            aria-label="Watch Reels"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover md:hidden"
              src="/images/hero-video/mobile.mp4"
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              src="/images/hero-video/main-vid.mp4"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white flex items-center justify-center">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-1" />
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <span className="text-white font-body text-xs tracking-[0.2em] uppercase">Reels</span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              poster={HERO_IMG}
              src="/images/hero-video/main-vid.mp4"
            >
              <source src="/images/hero-video/main-vid.mp4" type="video/mp4" />
              Your browser does not support video.
            </video>
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className="absolute top-6 right-6 z-[60] w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
              aria-label="Close"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 sm:right-6 xl:right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <p className="text-white/40 text-xs tracking-[0.5em] uppercase font-body [writing-mode:vertical-lr] rotate-180">
          Scroll to explore
        </p>
      </div>
    </section>
  );
}
