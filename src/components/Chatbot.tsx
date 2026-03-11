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
];

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
};

const TYPING_DELAY_MS = 400;

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

  const addBotMessage = useCallback((text: string, link?: { href: string; label: string }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        role: "bot",
        text,
        link,
      },
    ]);
    setLoading(false);
  }, []);

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
        addBotMessage(reply.text, reply.link);
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

  const showQuickReplies = messages.length === 0 || (messages.length > 0 && messages[messages.length - 1]?.role === "bot");

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 left-3 z-[45] flex w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl font-body sm:bottom-8 sm:left-4"
            style={{ maxHeight: "75vh" }}
            role="dialog"
            aria-label="Help chat"
          >
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <span className="text-sm font-medium text-foreground">Help</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[40vh]"
            >
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Hi! How can I help you today?
                </motion.div>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.role === "bot" && msg.link && (
                      <Link
                        href={msg.link.href}
                        className="mt-2 inline-block rounded border border-current px-2 py-1 text-xs font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
                        onClick={() => setOpen(false)}
                      >
                        {msg.link.label}
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-1 rounded-lg bg-muted px-3 py-2">
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {showQuickReplies && !loading && (
              <div className="border-t border-border px-4 py-2">
                <p className="mb-2 text-xs text-muted-foreground">Quick options</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="border-t border-border bg-muted/30 p-3">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                  aria-label="Message"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex-shrink-0 flex items-center justify-center rounded-lg bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <motion.button
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-3 z-[45] flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-card text-foreground shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring sm:bottom-6 sm:left-4"
          aria-label="Open help chat"
          aria-expanded={false}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}
