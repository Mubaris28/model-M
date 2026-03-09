import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-model.jpg";
import catBold from "@/assets/cat-bold.jpg";
import catGlamour from "@/assets/cat-glamour.jpg";

const slides = [
  {
    image: heroImg,
    subtitle: "Spring 2026 Collection",
    title: "DISCOVER\nEXTRAORDINARY\nTALENT",
    cta: "Browse Models",
    link: "/models",
  },
  {
    image: catBold,
    subtitle: "Bold & Fearless",
    title: "REDEFINE\nBEAUTY\nSTANDARDS",
    cta: "Explore Bold",
    link: "/category/bold",
  },
  {
    image: catGlamour,
    subtitle: "Red Carpet Ready",
    title: "GLAMOUR\nTHAT\nCAPTIVATES",
    cta: "View Glamour",
    link: "/category/glamour",
  },
];

const CinematicSlider = () => {
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showVideo) return;
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [showVideo]);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video fullscreen overlay */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black flex items-center justify-center"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
              poster={slides[current].image}
            >
              <source src="" type="video/mp4" />
              Your browser does not support video.
            </video>
            <button
              onClick={handleCloseVideo}
              className="absolute top-6 right-6 z-60 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].subtitle}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 cinematic-overlay" />
      <div className="absolute inset-0 cinematic-overlay-left" />

      <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-4">
              {slides[current].subtitle}
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-[120px] leading-[0.85] mb-8 text-white whitespace-pre-line">
              {slides[current].title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to={slides[current].link}
                className="inline-flex items-center gap-3 bg-gradient-red text-primary-foreground px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity group"
              >
                {slides[current].cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={handlePlayVideo}
                className="inline-flex items-center gap-3 border-2 border-white/40 text-white px-6 py-3.5 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all group"
              >
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                Watch Reels
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        <button onClick={prev} className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-0.5 transition-all duration-500 ${i === current ? "w-12 bg-primary" : "w-6 bg-white/20"}`}
            />
          ))}
        </div>
        <button onClick={next} className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-primary transition-all">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Side text */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
        <p className="text-white/40 text-xs tracking-[0.5em] uppercase font-body [writing-mode:vertical-lr] rotate-180">
          Scroll to explore
        </p>
      </div>
    </section>
  );
};

export default CinematicSlider;
