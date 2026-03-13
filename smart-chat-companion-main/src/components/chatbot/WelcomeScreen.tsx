import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Zap } from "lucide-react";

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const iconContainerVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 15, delay: 0.1 },
  },
};

const textVariants = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.5 },
  }),
};

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center relative">
      <motion.div
        className="absolute top-2 left-8 text-primary/20"
        variants={floatingVariants}
        animate="animate"
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
      <motion.div
        className="absolute top-6 right-10 text-primary/15"
        animate={{ y: [0, -6, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
      >
        <Zap className="h-3 w-3" />
      </motion.div>

      <motion.div
        variants={iconContainerVariants}
        initial="initial"
        animate="animate"
        className="relative"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <MessageCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      <motion.p
        custom={0}
        variants={textVariants}
        initial="initial"
        animate="animate"
        className="text-sm font-semibold text-foreground"
      >
        Hi! How can I help you? ✨
      </motion.p>
      <motion.p
        custom={1}
        variants={textVariants}
        initial="initial"
        animate="animate"
        className="text-xs text-muted-foreground max-w-[220px]"
      >
        Choose a quick option or type your question below.
      </motion.p>
    </div>
  );
}
