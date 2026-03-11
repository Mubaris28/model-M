// Rule-based chatbot: intent matching, predefined replies, optional health check.
// Uses same API base as api.ts for GET /api/health.

export type ChatReply = {
  text: string;
  link?: { href: string; label: string };
};

function getApiBase(): string {
  if (typeof window === "undefined") return "";
  const raw =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw)
    ? raw.replace(/\/+$/, "")
    : `https://${raw.replace(/^\/+/, "")}`;
}

function normalize(msg: string): string {
  return msg
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function match(msg: string, keywords: string[]): boolean {
  const n = normalize(msg);
  return keywords.some((k) => n.includes(k));
}

async function checkHealth(): Promise<{ ok: boolean }> {
  const base = getApiBase();
  const url = base ? `${base}/api/health` : "/api/health";
  try {
    const res = await fetch(url, { method: "GET" });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

type IntentReply = ChatReply | Promise<ChatReply>;

const INTENTS: Array<{
  name: string;
  keywords: string[];
  reply: () => IntentReply;
}> = [
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"],
    reply: (): ChatReply => ({
      text: "Hi! I'm here to help with anything about Model Management Mauritius. You can ask about applying as a model, contact, your dashboard, or check if the site is working.",
    }),
  },
  {
    name: "become_model",
    keywords: ["apply", "become a model", "become model", "join", "register as model", "how to apply"],
    reply: (): ChatReply => ({
      text: "You can apply to become a model through our application process. We'll guide you through the steps and required materials.",
      link: { href: "/become-model", label: "Go to Become a model" },
    }),
  },
  {
    name: "contact",
    keywords: ["contact", "email", "support", "help", "get in touch", "reach"],
    reply: (): ChatReply => ({
      text: "You can reach us through our contact form. We'll get back to you as soon as possible.",
      link: { href: "/contact", label: "Open contact form" },
    }),
  },
  {
    name: "dashboard",
    keywords: ["dashboard", "my account", "profile", "my profile", "account"],
    reply: (): ChatReply => ({
      text: "Your dashboard is where you manage your profile, castings, and bookings. Log in to access it.",
      link: { href: "/dashboard", label: "Go to dashboard" },
    }),
  },
  {
    name: "login_signup",
    keywords: ["login", "log in", "sign in", "sign up", "signup", "register"],
    reply: (): ChatReply => ({
      text: "You can log in or create an account here.",
      link: { href: "/login", label: "Log in" },
    }),
  },
  {
    name: "casting",
    keywords: ["casting", "castings", "jobs", "opportunities", "audition"],
    reply: (): ChatReply => ({
      text: "Browse open castings and apply to opportunities that match your profile.",
      link: { href: "/casting", label: "View castings" },
    }),
  },
  {
    name: "marketplace",
    keywords: ["marketplace", "shop", "market"],
    reply: (): ChatReply => ({
      text: "Explore our marketplace for talent and services.",
      link: { href: "/marketplace", label: "Open marketplace" },
    }),
  },
  {
    name: "about",
    keywords: ["about", "who are you", "what is this", "company", "platform"],
    reply: (): ChatReply => ({
      text: "Model Management Mauritius is a professional modeling platform for models and talent in Mauritius.",
      link: { href: "/about", label: "Learn more" },
    }),
  },
  {
    name: "site_status",
    keywords: [
      "is the site working",
      "site working",
      "site down",
      "status",
      "is site up",
      "website working",
      "server",
    ],
    reply: async (): Promise<ChatReply> => {
      const { ok } = await checkHealth();
      if (ok) {
        return { text: "Yes, the site is running. If something isn't loading for you, try refreshing or use the Contact page." };
      }
      return {
        text: "We're having trouble reaching the server right now. Please try again in a moment or use the Contact page if it persists.",
        link: { href: "/contact", label: "Contact us" },
      };
    },
  },
];

const FALLBACK_REPLY: ChatReply = {
  text: "I can help with applying as a model, contact, dashboard, or site status. Try one of the options below or ask in your own words.",
};

export async function getReply(
  message: string,
  _pathname?: string
): Promise<ChatReply> {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      text: "Type a message or pick one of the quick options to get started.",
    };
  }

  const n = normalize(trimmed);
  for (const intent of INTENTS) {
    if (!match(trimmed, intent.keywords)) continue;
    const reply = intent.reply();
    return typeof (reply as Promise<ChatReply>).then === "function"
      ? (reply as Promise<ChatReply>)
      : (reply as ChatReply);
  }

  // Site status is async; others are sync. Double-check site_status for loose match.
  const statusKeywords = ["working", "down", "up", "status", "broken", "error"];
  if (statusKeywords.some((k) => n.includes(k)) && (n.includes("site") || n.includes("web") || n.includes("server"))) {
    const { ok } = await checkHealth();
    if (ok) {
      return { text: "The site is running. If you're seeing an error, try refreshing or contact us." };
    }
    return {
      text: "We're having trouble reaching the server. Try again later or use the Contact page.",
      link: { href: "/contact", label: "Contact us" },
    };
  }

  return FALLBACK_REPLY;
}
