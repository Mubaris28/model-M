import { Camera, Users, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "12,500+", label: "Registered Models" },
  { icon: Camera, value: "3,200+", label: "Photo Shoots" },
  { icon: Award, value: "850+", label: "Casting Calls" },
  { icon: Globe, value: "45+", label: "Countries" },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-4" />
              <p className="font-display text-4xl md:text-5xl text-gradient-red mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-xs font-body tracking-[0.2em] uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
