import { motion } from "framer-motion";
import { QUICK_OPTIONS } from "@/lib/chatbot";

type Props = {
  onSelect: (opt: string) => void;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const chipVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 500, damping: 25 },
  },
};

export default function QuickOptions({ onSelect }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-1.5 border-t border-border/50 px-3 py-2.5"
    >
      {QUICK_OPTIONS.map((opt) => (
        <motion.button
          key={opt}
          variants={chipVariants}
          whileHover={{
            scale: 1.06,
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(opt)}
          className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          {opt}
        </motion.button>
      ))}
    </motion.div>
  );
}
