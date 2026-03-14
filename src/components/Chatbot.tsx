"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import Link from "next/link";
import { getReply } from "@/lib/chatbot";

const QUICK_REPLIES = [
  "Apply as model",
  "Contact",
  "Dashboard",
  "Is the site working?",
  "How it works",
  "Report issue",
  "View models",
  "Safety & Trust",
];

/** Friendly welcome GIF (wave) - optional; can be replaced with local asset */
const WELCOME_GIF =
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
  gifUrl?: string;
};

const TYPING_DELAY_MS = 400;

const messageVariants = {
  user: {
    initial: { opacity: 0, x: 20, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 10 },
  },
  bot: {
    initial: { opacity: 0, x: -20, scale: 0.96 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -10 },
  },
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const addBotMessage = useCallback(
    (text: string, link?: { href: string; label: string }, gifUrl?: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: "bot",
          text,
          link,
          gifUrl,
        },
      ]);
      setLoading(false);
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: "user", text: trimmed },
      ]);
      setInput("");
      setLoading(true);
      scrollToBottom();

      await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));

      try {
        const reply = await getReply(trimmed);
        addBotMessage(reply.text, reply.link, reply.gifUrl);
      } catch {
        addBotMessage(
          "Something went wrong. Please try again or use the Contact page.",
          { href: "/contact", label: "Contact us" }
        );
      }
      scrollToBottom();
    },
    [loading, addBotMessage, scrollToBottom]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  const handleChipClick = useCallback(
    (chip: string) => {
      sendMessage(chip);
    },
    [sendMessage]
  );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      scrollToBottom();
    }
  }, [open, messages.length, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    const el = panelRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const showQuickReplies =
    messages.length === 0 ||
    (messages.length > 0 && messages[messages.length - 1]?.role === "bot");

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed bottom-24 left-4 z-[45] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl font-body sm:bottom-8 sm:left-6"
            style={{
              marginBottom: "env(safe-area-inset-bottom, 0)",
              marginLeft: "env(safe-area-inset-left, 0)",
              maxHeight: "80vh",
            }}
            role="dialog"
            aria-label="Help chat"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3.5">
              <span className="text-sm font-semibold text-foreground">
                Help
              </span>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[45vh]"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted/60 mb-3 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={WELCOME_GIF}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Hi! How can I help you today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a quick option or type your question.
                  </p>
                </motion.div>
              )}
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={msg.role === "user" ? messageVariants.user : messageVariants.bot}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.role === "bot" && msg.gifUrl && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={msg.gifUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.role === "bot" && msg.link && (
                        <Link
                          href={msg.link.href}
                          className="mt-2 inline-flex items-center rounded-lg border border-current px-3 py-1.5 text-xs font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring transition opacity"
                          onClick={() => setOpen(false)}
                        >
                          {msg.link.label}
                        </Link>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                    <span className="chat-typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="chat-typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="chat-typing-dot h-2 w-2 rounded-full bg-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick options */}
            {showQuickReplies && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="border-t border-border px-4 py-3 bg-muted/20"
              >
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quick options
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((chip, i) => (
                    <motion.button
                      key={chip}
                      type="button"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChipClick(chip)}
                      className="rounded-full border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-muted hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      {chip}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-border bg-muted/30 p-3"
            >
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-shadow"
                  aria-label="Message"
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 flex items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-colors"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB - white circle, black border, black icon */}
      {!open && (
        <motion.button
          type="button"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.2 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-4 z-[45] flex h-14 w-14 items-center justify-center rounded-full border-2 border-foreground bg-card text-foreground shadow-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          style={{
            marginBottom: "env(safe-area-inset-bottom, 0)",
            marginLeft: "env(safe-area-inset-left, 0)",
          }}
          aria-label="Open help chat"
          aria-expanded={false}
        >
          <MessageCircle className="h-6 w-6" strokeWidth={2} />
        </motion.button>
      )}
    </>
  );
}
