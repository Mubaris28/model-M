import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

type Props = { onClick: () => void };

export default function ChatFAB({ onClick }: Props) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0, rotate: 180 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.12, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label="Open help chat"
      className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-xl"
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        left: "max(1rem, env(safe-area-inset-left))",
      }}
    >
      {/* Pulse ring */}
      <motion.span
        className="absolute inset-0 rounded-full bg-primary/30"
        animate={{ scale: [1, 1.5, 1.5], opacity: [0.5, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.8, 1.8], opacity: [0.3, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
      />
      <MessageCircle className="h-6 w-6 text-primary-foreground relative z-10" />
    </motion.button>
  );
}
