import { Sparkles, Star, Camera, Palette, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const actions = [
  { icon: Sparkles, label: "I'm New to the Spotlight", link: "/discover-path/im-new-to-the-spotlight", description: "Start your modeling journey" },
  { icon: Star, label: "I'm a Full-Time Model", link: "/discover-path/im-a-full-time-model", description: "Explore opportunities" },
  { icon: Camera, label: "I'm a Photographer", link: "/discover-path/im-a-creative-photographer", description: "Connect with talent" },
  { icon: Palette, label: "I'm a Creative Professional", link: "/discover-path/im-an-influencer-with-a-passion-for-creating", description: "Join our directory" },
];

const QuickActions = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <p className="text-primary font-body text-xs tracking-[0.5em] uppercase mb-2">Get Started</p>
          <h2 className="font-display text-4xl md:text-5xl">Find Your Path</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={action.link}
                className="group flex flex-col items-center text-center p-6 magazine-border hover:border-primary/40 transition-all duration-300 hover-lift h-full"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <action.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors mb-1">{action.label}</h3>
                <p className="text-muted-foreground text-xs font-body mb-3">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
