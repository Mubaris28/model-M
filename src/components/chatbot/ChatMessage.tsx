"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type MessageProps = {
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
  gifUrl?: string;
  onLinkClick?: () => void;
};

export default function ChatMessage({ role, text, link, gifUrl, onLinkClick }: MessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 30 : -30, scale: 0.88, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <motion.div
        whileHover={{ scale: 1.015, y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`relative max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-chat-bot text-foreground rounded-bl-sm border border-border/50"
        }`}
      >
        {/* Subtle glow behind user bubbles */}
        {isUser && (
          <motion.div
            className="absolute inset-0 rounded-2xl rounded-br-sm bg-primary/25 blur-xl -z-10"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
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

        <p className="whitespace-pre-wrap">{text}</p>

        {link && (
          <Link
            href={link.href}
            onClick={onLinkClick}
            className={`mt-2 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors ${
              isUser
                ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                : "border-primary/30 text-primary hover:bg-primary/5"
            }`}
          >
            {link.label}
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
