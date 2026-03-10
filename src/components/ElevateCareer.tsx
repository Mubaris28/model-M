import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";
import catCommercial from "@/assets/cat-commercial.jpg";

const ElevateCareer = () => {
  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative h-[350px] lg:h-auto overflow-hidden"
        >
          <img src={typeof catCommercial === "string" ? catCommercial : catCommercial.src} alt="Build career" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-gradient-red flex items-center p-10 md:p-16"
        >
          <div>
            <p className="text-primary-foreground/70 font-body text-xs tracking-[0.5em] uppercase mb-4">Elevate</p>
            <h2 className="font-display text-5xl md:text-6xl text-primary-foreground mb-6">Build Your Modeling Career</h2>
            <p className="text-primary-foreground/80 font-body text-sm leading-relaxed mb-8 max-w-md">
              We connect ambitious models with the industry's top agencies, photographers, and brands. Your talent deserves the spotlight.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:bg-card transition-colors group">
              Connect Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ElevateCareer;
