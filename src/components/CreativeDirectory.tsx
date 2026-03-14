import { Camera, Palette, Scissors, Star, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router-next";
import { motion } from "framer-motion";

const creativeRoles = [
  { icon: Star, label: "Influencer", link: "/models" },
  { icon: Camera, label: "Photographer", link: "/contact" },
  { icon: Scissors, label: "Stylist", link: "/contact" },
  { icon: Palette, label: "Talent Artist", link: "/contact" },
];

const CreativeDirectory = () => {
  return (
    <section className="bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative h-[350px] lg:h-auto overflow-hidden order-2 lg:order-1"
        >
          <img src="/images/Categories/cat-artistic.jpg" alt="Creative" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="dark-section flex items-center p-10 md:p-16 order-1 lg:order-2"
        >
          <div>
            <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-4">Talent Hub</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-4">Creative Directory</h2>
            <p className="text-white/60 font-body text-sm leading-relaxed mb-8 max-w-md">
              Turn your talent into success. Connect with the best in the industry.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {creativeRoles.map((role) => (
                <Link
                  key={role.label}
                  to={role.link}
                  className="group flex items-center gap-3 border border-white/10 px-4 py-3 hover:border-primary transition-colors"
                >
                  <role.icon className="w-4 h-4 text-primary" />
                  <span className="text-white/80 font-body text-xs tracking-wider uppercase group-hover:text-primary transition-colors">{role.label}</span>
                  <ArrowRight className="w-3 h-3 text-white/30 ml-auto group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeDirectory;
