"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { Camera, Zap, Star, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Star,
    title: "A vast selection of casting calls",
    text: "Browse opportunities that match your profile and experience level.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  },
  {
    icon: TrendingUp,
    title: "Endless opportunities to get discovered",
    text: "Brands and photographers are actively looking for talent like you.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    icon: Zap,
    title: "A constantly growing list of gigs",
    text: "New castings added regularly across fashion, commercial, and more.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    icon: Camera,
    title: "Countless casting calls happening now",
    text: "Apply today and take the next step in your modeling journey.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
  },
];

export default function ModelsTalentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[65vh] min-h-[420px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=80"
          alt="Models & Talents"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 cinematic-overlay" />
        <div className="absolute inset-0 cinematic-overlay-left" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">For Models</p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-4">
              Dreamed of<br />Modeling?
            </h1>
            <p className="font-body text-lg text-white/80 mb-8 max-w-lg">
              Originality is what brands are falling in love with. Now&apos;s your chance.
            </p>
            <Link to="/casting" className="btn-primary inline-flex">Track Casting Openings</Link>
          </motion.div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Why Join</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">Where Professionals<br />Find Tomorrow&apos;s Top Models</h2>
            <p className="text-muted-foreground font-body text-sm mt-4 max-w-lg">Casting calls made for everyone — from first shoots to world-class campaigns.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card magazine-border overflow-hidden"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={f.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 w-9 h-9 bg-primary flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{f.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Link to="/signup" className="btn-primary inline-flex">Sign Up Now</Link>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Simple Process</p>
          <h2 className="font-display text-5xl md:text-6xl text-background mb-12">Start Your Journey<br />in 3 Steps</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Build Your Profile",
                text: "Upload your top photos, info, and Instagram to get noticed by brands, photographers, and agencies.",
                image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400&q=80",
              },
              {
                step: "02",
                title: "Get Discovered",
                text: "Appear in our directory and let casting directors and brands find you for their projects.",
                image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
              },
              {
                step: "03",
                title: "Apply to Castings",
                text: "Browse open castings and apply to opportunities that match your look and experience.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
              },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="relative h-52 overflow-hidden mb-5">
                  <img src={s.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 left-4">
                    <span className="font-display text-5xl text-white/20">{s.step}</span>
                  </div>
                </div>
                <p className="text-primary font-body text-[10px] tracking-[0.4em] uppercase mb-1">Step {s.step}</p>
                <h3 className="font-display text-2xl text-background mb-2">{s.title}</h3>
                <p className="text-background/60 font-body text-sm leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-12">
            <Link to="/signup" className="btn-primary inline-flex">Get Started</Link>
            <Link
              to="/casting"
              className="border border-background/30 text-background px-6 py-3 font-body text-sm uppercase hover:border-background/60 transition-colors"
            >
              View Castings
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
