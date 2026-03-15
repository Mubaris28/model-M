"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import { Search, Briefcase, Layers, ArrowRight } from "lucide-react";

const howItWorks = [
  {
    icon: Search,
    title: "Browse our directory or create a casting call",
    text: "Submit your casting calls to access thousands of professional models — or search directly.",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80",
  },
  {
    icon: Layers,
    title: "Discover thousands of models",
    text: "Access a variety of verified and talented individuals ready for your next project.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    icon: Briefcase,
    title: "Directly connect and book",
    text: "Hire professional models for your projects with ease. No middlemen, no delays.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
];

const reasons = [
  { title: "All-in-One Platform", text: "User-friendly tools to manage everything from casting to bookings." },
  { title: "Cost-Effective", text: "Access talented models for free collaborations or at your desired rates." },
  { title: "1,500+ Models", text: "Connect directly with over 1,500 active and diverse models in Mauritius." },
  { title: "Verified Talent", text: "All profiles are reviewed and verified by our dedicated team." },
];

export default function ProfessionalsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page header */}
      <div className="pt-24 pb-10 md:pt-32 md:pb-14 container mx-auto px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">For Professionals</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none mb-4">
            Simplify Your<br />Model Search
          </h1>
          <p className="font-body text-base md:text-lg text-muted-foreground mb-6 max-w-xl">
            Take charge of discovering models and talent with ease. One platform for all your casting needs.
          </p>
          <Link to="/signup" className="btn-primary inline-flex">Get Started Free</Link>
        </motion.div>
      </div>

      {/* How it works */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">How It Works</p>
            <h2 className="font-display text-5xl md:text-6xl line-accent">How Can Model Management Help You?</h2>
            <p className="text-muted-foreground font-body text-sm mt-4 max-w-lg">
              Find the perfect talent for your projects with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group bg-card magazine-border overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-3 left-3 w-9 h-9 bg-primary flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-3 left-4">
                    <span className="font-display text-4xl text-white/20">0{i + 1}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/post-casting" className="btn-primary inline-flex">Create a Casting</Link>
            <Link to="/models" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors">
              Discover Models
            </Link>
            <Link to="/contact" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Why us — dark section with image */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/90" />
        <div className="relative z-10 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Our Advantage</p>
            <h2 className="font-display text-5xl md:text-6xl text-background mb-10">Why Model Management Mauritius?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background/10 border border-background/20 p-6 backdrop-blur-sm"
                >
                  <h3 className="font-display text-xl text-background mb-2">{r.title}</h3>
                  <p className="text-background/60 font-body text-sm leading-relaxed">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-3">Get Started Today</p>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mb-4">The Fast Track to Top Talent</h2>
          <p className="text-muted-foreground font-body text-sm mb-8">
            Register for free and discover how effective our platform is. Choose your path: Photographer, Brand, or Casting Director.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
              Start Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/models" className="border border-border px-6 py-3 font-body text-sm uppercase hover:border-primary hover:text-primary transition-colors">
              Browse Models
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
