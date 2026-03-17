import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";

const GetDiscovered = () => {
  return (
    <section className="bg-primary py-14 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-white/90 font-body text-xs tracking-[0.5em] uppercase mb-4">Join Us</p>
          <h2 className="font-display text-6xl md:text-8xl text-white mb-6">Get Discovered</h2>
          <p className="text-white/80 font-body text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Join a variety of models and talents who found success through our platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:bg-white/95 hover:shadow-lg transition-all group">
              Sign up now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:bg-white hover:text-primary transition-all">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetDiscovered;
