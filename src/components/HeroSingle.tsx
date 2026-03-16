"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/lib/router-next";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMG = "/images/hero/hero-model.jpg";
const MOBILE_VIDEO = "/images/hero-video/mobile.mp4";
const MAIN_VIDEO = "/images/hero-video/main-vid.mp4";

export default function HeroSingle() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoInView, setVideoInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Lazy-load video sources only when hero is in view (avoids ERR_CACHE_OPERATION_NOT_SUPPORTED on other pages)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVideoInView(e.isIntersecting),
      { rootMargin: "50px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative min-h-[100dvh] h-[100dvh] max-h-[100dvh] md:min-h-[70vh] md:h-screen md:max-h-[100dvh] overflow-hidden bg-foreground">
      <img
        src={HERO_IMG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay-left pointer-events-none" />

      {/* Mobile: content centered; desktop: content between */}
      <div className="relative z-10 container mx-auto px-5 sm:px-6 h-full min-h-0 flex flex-col lg:flex-row items-stretch lg:items-center max-lg:justify-center lg:justify-between pt-[72px] pb-8 sm:pt-24 md:pt-32 lg:pt-32 xl:pt-36 sm:pb-10 md:pb-10 lg:pb-8 xl:pb-10">
        <div className="max-w-3xl w-full flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 min-h-0">
          {/* Content block */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <img
              src="/images/hero-logo/modelmanagement-logo.png"
              alt="Model Management"
              className="block w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-auto object-contain"
            />
            <p className="text-primary font-body text-xs sm:text-xs md:text-xs tracking-[0.5em] uppercase">
              Model Management
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-[0.95] text-white uppercase">
              <span className="block">One Platform</span>
              <span className="block">for all</span>
              <span className="block">models</span>
            </h1>
            <p className="text-white/90 font-body text-sm sm:text-base md:text-base lg:text-lg tracking-wide max-w-md">
              Single account for your modeling journey
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-4">
              <Link
                to="/modelsTalents"
                className="inline-flex items-center gap-2 sm:gap-2 md:gap-3 bg-gradient-red text-primary-foreground px-5 py-3.5 sm:px-6 sm:py-3 md:px-8 md:py-4 font-body font-medium tracking-[0.15em] uppercase text-sm sm:text-xs md:text-sm hover:opacity-90 transition-opacity group"
              >
                Models
                <ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/professionals"
                className="inline-flex items-center gap-2 sm:gap-2 md:gap-3 border-2 border-white text-white px-5 py-3.5 sm:px-6 sm:py-3 md:px-8 md:py-4 font-body font-medium tracking-[0.15em] uppercase text-sm sm:text-xs md:text-sm hover:border-primary hover:text-primary transition-all group"
              >
                Professionals
                <ArrowRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
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
              preload="none"
              className="absolute inset-0 w-full h-full object-cover md:hidden"
              src={videoInView ? MOBILE_VIDEO : undefined}
            />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover hidden md:block"
              src={videoInView ? MAIN_VIDEO : undefined}
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
              preload="none"
              poster={HERO_IMG}
              src={MAIN_VIDEO}
            >
              <source src={MAIN_VIDEO} type="video/mp4" />
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

      {/* Center bottom: Casting Event scroll cue — highlighted; smaller on mobile */}
      <a
        href="#casting-event"
        className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 sm:gap-3 font-body text-[10px] sm:text-sm md:text-base tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors group/event"
        aria-label="Scroll to Casting Event"
      >
        <span className="flex items-center gap-1.5 sm:gap-2 pb-0.5 sm:pb-1 border-b-2 border-primary text-white group-hover/event:text-primary group-hover/event:border-white transition-all duration-300">
          <span className="text-primary font-medium">Casting Event</span>
          <span className="text-white/90">·</span>
          <span className="text-white font-medium">18 Apr</span>
        </span>
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="inline-flex text-primary"
        >
          <ChevronDown className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </motion.span>
      </a>
    </section>
  );
}
