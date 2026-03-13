"use client";

import { useState } from "react";
import { Link } from "@/lib/router-next";
import { ArrowRight, Play } from "lucide-react";
import { imgSrc } from "@/lib/utils";
import heroImg from "@/assets/hero-model.jpg";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSingle() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[70vh] h-screen max-h-[100dvh] overflow-hidden">
      <img
        src={imgSrc(heroImg)}
        alt="One Platform for all models"
        className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-[65%_center] lg:object-center"
      />
      <div className="absolute inset-0 cinematic-overlay" />
      <div className="absolute inset-0 cinematic-overlay-left" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-col lg:flex-row items-start lg:items-center justify-end lg:justify-between gap-6 lg:gap-8 xl:gap-10 pt-28 sm:pt-32 md:pt-36 lg:pt-32 xl:pt-36 pb-10 sm:pb-12 lg:pb-8 xl:pb-10">
        <div className="max-w-3xl w-full shrink-0">
          <img
            src="/images/hero-logo/modelmanagement-logo.png"
            alt="Model Management"
            className="block w-fit object-contain mb-3 sm:mb-4"
            style={{ width: "240px", height: "100px", marginLeft: "-50px" }}
          />
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2 sm:mb-3">
            Model Management
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-[0.9] mb-3 sm:mb-4 text-white uppercase">
            <span className="block">One Platform</span>
            <span className="block">for all</span>
            <span className="block">models</span>
          </h1>
          <p className="text-white/90 font-body text-sm sm:text-base md:text-lg tracking-wide mb-4 sm:mb-5 md:mb-6">
            Single account for your modeling journey
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/modelsTalents"
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-red text-primary-foreground px-5 py-3 sm:px-8 sm:py-4 font-body font-medium tracking-[0.15em] uppercase text-xs sm:text-sm hover:opacity-90 transition-opacity group"
            >
              Models
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/professionals"
              className="inline-flex items-center gap-2 sm:gap-3 border-2 border-white text-white px-5 py-3 sm:px-8 sm:py-4 font-body font-medium tracking-[0.15em] uppercase text-xs sm:text-sm hover:border-primary hover:text-primary transition-all group"
            >
              Professionals
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="hidden md:flex flex-shrink-0 items-end justify-end w-[200px] lg:w-[170px] xl:w-[210px] 2xl:w-[240px] self-end lg:self-auto mt-auto lg:mt-0">
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
              poster={imgSrc(heroImg)}
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
