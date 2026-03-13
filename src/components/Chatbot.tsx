"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { getReply } from "@/lib/chatbot";
import ChatMessage from "./chatbot/ChatMessage";
import TypingIndicator from "./chatbot/TypingIndicator";
import WelcomeScreen from "./chatbot/WelcomeScreen";
import QuickOptions from "./chatbot/QuickOptions";
import ChatFAB from "./chatbot/ChatFAB";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
  gifUrl?: string;
};

const TYPING_DELAY_MS = 500;

let msgId = 0;
const nextId = () => `msg-${++msgId}`;

const panelVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 350, damping: 25 },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.9,
    filter: "blur(8px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(scrollToBottom, [messages, loading, scrollToBottom]);

  const handleKeyDown = useCallback((e: ReactKeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text: text.trim() }]);
      setInput("");
      setLoading(true);

      await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));

      try {
        const reply = await getReply(text);
        setMessages((prev) => [
          ...prev,
          { id: nextId(), role: "bot", text: reply.text, link: reply.link, gifUrl: reply.gifUrl },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "bot",
            text: "Something went wrong. Please try again or use the Contact page.",
            link: { href: "/contact", label: "Contact us" },
          },
        ]);
      }
      setLoading(false);
    },
    [loading]
  );

  const showQuickOptions =
    messages.length === 0 || (messages[messages.length - 1]?.role === "bot" && !loading);

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && <ChatFAB onClick={() => setOpen(true)} />}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Help chat"
            aria-modal="true"
            onKeyDown={handleKeyDown}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed z-50 flex flex-col overflow-hidden border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/20"
            style={{
              bottom: "max(1.5rem, env(safe-area-inset-bottom))",
              left: "max(1rem, env(safe-area-inset-left))",
              width: "min(390px, calc(100vw - 2rem))",
              height: "min(580px, calc(100vh - 3rem))",
              borderRadius: "1rem",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent"
            >
              <div className="flex items-center gap-2.5">
                {/* Brand mark */}
                <div className="flex h-7 w-7 items-center justify-center bg-primary flex-shrink-0">
                  <span className="font-display text-sm text-primary-foreground leading-none tracking-widest">M</span>
                </div>
                <div>
                  <h2 className="text-[13px] font-semibold text-foreground leading-none">Help Assistant</h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-body">Model Management</p>
                </div>
                {/* Live dot */}
                <motion.span
                  className="ml-1 flex h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary/60" />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setOpen(false)}
                  aria-label="Close help chat"
                  className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && <WelcomeScreen />}

              <AnimatePresence>
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    text={msg.text}
                    link={msg.link}
                    gifUrl={msg.gifUrl}
                    onLinkClick={() => setOpen(false)}
                  />
                ))}
              </AnimatePresence>

              <AnimatePresence>{loading && <TypingIndicator />}</AnimatePresence>
            </div>

            {/* Quick options */}
            <AnimatePresence>
              {showQuickOptions && !loading && <QuickOptions onSelect={sendMessage} />}
            </AnimatePresence>

            {/* Input */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border-t border-border/50 px-3 py-2.5 bg-gradient-to-t from-primary/[0.03] to-transparent"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="Type a message..."
                  disabled={loading}
                  className="flex-1 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all font-body"
                />
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -8 }}
                  whileTap={{ scale: 0.9, rotate: 8 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/30 transition-opacity disabled:opacity-30 disabled:shadow-none"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
