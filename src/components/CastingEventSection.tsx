"use client";

import { Link } from "@/lib/router-next";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EVENT_DATE = "18 April 2026";
const EVENT_VENUE = "Labourdonnais Waterfront Hotel";

export default function CastingEventSection() {
  return (
    <section id="casting-event" className="relative py-12 md:py-16 overflow-hidden scroll-mt-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative border border-white/15 border-t-primary/50 bg-black text-white p-6 md:p-10 lg:p-12"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-4">
              <p className="font-body text-xs tracking-[0.4em] uppercase text-primary">
                Upcoming Event
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[0.95] uppercase text-white">
                Casting Event
              </h2>
              <p className="font-body text-white/80 text-sm md:text-base max-w-lg leading-relaxed">
                Meet industry professionals, get discovered, and take the next step in your modeling career. Open call for models and talent.
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body tracking-[0.2em] uppercase text-white/50">Date</p>
                    <p className="font-display text-lg text-white">{EVENT_DATE}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body tracking-[0.2em] uppercase text-white/50">Venue</p>
                    <p className="font-display text-lg text-white">{EVENT_VENUE}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:shrink-0">
              <Link
                to="/event"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity group"
              >
                View details & register
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
