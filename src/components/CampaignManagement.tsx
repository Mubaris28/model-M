import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";

const CampaignManagement = () => {
  return (
    <section className="relative h-[500px] md:h-[550px] overflow-hidden">
      <img src="/images/Categories/cat-glamour.jpg" alt="Campaign" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 flex items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="max-w-xl">
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-4">For Brands</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-6">Full-Service Campaign Management</h2>
            <p className="text-white/60 font-body text-sm leading-relaxed mb-8">
              Elevate your brand with our end-to-end campaign services. From casting to post-production, we handle everything.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-gradient-red text-primary-foreground px-8 py-4 font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-90 transition-opacity group">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CampaignManagement;
