import { Link } from "react-router-dom";
import { Camera, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SelectRolePage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-red flex items-center justify-center">
            <span className="font-display text-primary-foreground text-lg leading-none">É</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-foreground">ÉLITE</span>
        </Link>

        <h2 className="font-display text-5xl mb-2">Choose Your Path</h2>
        <p className="text-muted-foreground text-sm font-body mb-10">Select how you want to use ÉLITE Models</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/become-model"
            className="group magazine-border p-8 hover:border-primary/40 transition-all duration-300 hover-lift text-center"
          >
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
              <Camera className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">I'm a Model</h3>
            <p className="text-muted-foreground text-xs font-body mb-4">Build your portfolio, get discovered, and land casting calls</p>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-body tracking-[0.15em] uppercase">
              Continue <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/register"
            className="group magazine-border p-8 hover:border-primary/40 transition-all duration-300 hover-lift text-center"
          >
            <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
              <Briefcase className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">I'm a Professional</h3>
            <p className="text-muted-foreground text-xs font-body mb-4">Post castings, manage campaigns, and find talent</p>
            <span className="inline-flex items-center gap-2 text-primary text-xs font-body tracking-[0.15em] uppercase">
              Continue <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectRolePage;
