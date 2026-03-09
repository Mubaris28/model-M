import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-model.jpg";

const ModelsCTA = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <img src={heroImg} alt="Start modeling" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl px-6"
        >
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-4">Your Journey Starts Here</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-6">Start Your Modeling Journey Now</h2>
          <p className="text-white/60 font-body text-sm mb-8 max-w-md mx-auto">
            Whether you're just starting out or a seasoned professional, we have the perfect path for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-red text-primary-foreground px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity group">
              <Sparkles className="w-4 h-4" />
              I'm New to the Spotlight
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/models" className="inline-flex items-center gap-3 border border-white/30 text-white px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:border-primary hover:text-primary transition-all group">
              <Star className="w-4 h-4" />
              I'm a Full-Time Model
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelsCTA;
