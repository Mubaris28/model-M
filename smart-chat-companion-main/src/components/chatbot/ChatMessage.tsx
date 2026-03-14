import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type MessageProps = {
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
  gifUrl?: string;
};

export default function ChatMessage({ role, text, link, gifUrl }: MessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 30 : -30, scale: 0.85, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-br-sm"
            : "bg-chat-bot text-foreground rounded-bl-sm backdrop-blur-sm border border-border/50"
        }`}
      >
        {/* Glow effect for user messages */}
        {isUser && (
          <motion.div
            className="absolute inset-0 rounded-2xl rounded-br-sm bg-primary/20 blur-xl -z-10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {gifUrl && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            src={gifUrl}
            alt=""
            className="mb-2 h-20 w-20 rounded-lg object-cover"
          />
        )}
        <p>{text}</p>
        {link && (
          <motion.a
            href={link.href}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ x: 3 }}
            className={`mt-2 inline-flex items-center gap-1 text-xs font-medium transition-colors ${
              isUser
                ? "text-primary-foreground/80 hover:text-primary-foreground"
                : "text-primary hover:text-primary/80"
            }`}
          >
            {link.label}
            <ExternalLink className="h-3 w-3" />
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
}
