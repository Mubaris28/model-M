// Rule-based chatbot: intent matching, predefined replies, optional health check.
// Uses same API base as api.ts for GET /api/health.

export type ChatReply = {
  text: string;
  link?: { href: string; label: string };
  /** Optional GIF or image URL to show in the bot bubble (e.g. welcome or reaction). */
  gifUrl?: string;
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
    keywords: ["apply", "apply as model", "become a model", "become model", "join", "register as model", "how to apply", "i want to be a model"],
    reply: (): ChatReply => ({
      text: "You can apply to become a model through our application process. We'll guide you through the steps and required materials.",
      link: { href: "/become-model", label: "Go to Become a model" },
    }),
  },
  {
    name: "contact_details",
    keywords: [
      "email", "call", "contact", "number", "address", "phone", "whatsapp",
      "reach us", "get in touch", "where are you", "location", "office", "visit",
      "email us", "call us", "visit us", "info@", "phone number",
    ],
    reply: (): ChatReply => ({
      text: "Email Us\ninfo@modelmanagement.mu\nWe respond within 24 hours\n\nCall Us (Office)\n+230 468 6969\nMon–Fri, 8am – 6pm\n\nWhatsApp\n+230 5256 6333\nChat with us\n\nVisit Us\n2nd Floor, Unity House\nRue Du Savoir, Cybercity, Ebene, Mauritius 72201",
      link: { href: "/contact", label: "Open contact form" },
    }),
  },
  {
    name: "contact",
    keywords: ["support", "help"],
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
    name: "report",
    keywords: ["report", "report issue", "report a problem", "complaint", "report bug", "report abuse"],
    reply: (): ChatReply => ({
      text: "You can report an issue or concern through our report form. We take all reports seriously and will follow up.",
      link: { href: "/report", label: "Report an issue" },
    }),
  },
  {
    name: "how_it_works",
    keywords: ["how it works", "how does it work", "how does this work", "process", "getting started"],
    reply: (): ChatReply => ({
      text: "Learn how Model Management works: from signing up to applying for castings and building your portfolio.",
      link: { href: "/footer/how-it-works", label: "How it works" },
    }),
  },
  {
    name: "safety",
    keywords: ["safety", "trust", "safe", "safety and trust", "safety & trust", "secure", "verification"],
    reply: (): ChatReply => ({
      text: "We take safety and trust seriously. Read about verification, secure chats, and model agreements.",
      link: { href: "/footer/safety-and-trust", label: "Safety & Trust" },
    }),
  },
  {
    name: "support",
    keywords: ["support", "help centre", "faq", "faqs", "frequently asked"],
    reply: (): ChatReply => ({
      text: "Visit our support section for FAQs and help. You can also contact us directly.",
      link: { href: "/footer/support", label: "Support" },
    }),
  },
  {
    name: "modelling_advice",
    keywords: ["modelling advice", "modeling advice", "advice", "tips for models", "career advice"],
    reply: (): ChatReply => ({
      text: "Get practical modelling advice: from building a portfolio to handling castings and staying professional.",
      link: { href: "/footer/modelling-advice", label: "Modelling advice" },
    }),
  },
  {
    name: "careers",
    keywords: ["career", "careers", "jobs", "work with us", "hiring"],
    reply: (): ChatReply => ({
      text: "Interested in working with us? Check our careers page for open positions.",
      link: { href: "/career", label: "Careers" },
    }),
  },
  {
    name: "professionals",
    keywords: ["professional", "professionals", "photographer", "agency", "brand", "client"],
    reply: (): ChatReply => ({
      text: "Professionals can join the platform to post castings, find talent, and collaborate. Learn more here.",
      link: { href: "/professionals", label: "For professionals" },
    }),
  },
  {
    name: "categories",
    keywords: ["categories", "category", "types of models", "model types"],
    reply: (): ChatReply => ({
      text: "Browse models by category: fashion, commercial, fitness, and more.",
      link: { href: "/categories", label: "View categories" },
    }),
  },
  {
    name: "directory",
    keywords: ["directory", "model directory", "find models", "search models"],
    reply: (): ChatReply => ({
      text: "Use our directory to search and discover models and talent.",
      link: { href: "/directory", label: "Open directory" },
    }),
  },
  {
    name: "sponsor",
    keywords: ["sponsor", "sponsorship", "partner", "partners"],
    reply: (): ChatReply => ({
      text: "Learn about sponsorship and partnership opportunities with Model Management.",
      link: { href: "/sponsor", label: "Sponsor / Partners" },
    }),
  },
  {
    name: "forgot_password",
    keywords: ["forgot password", "reset password", "password reset", "lost password"],
    reply: (): ChatReply => ({
      text: "You can reset your password via the forgot password page. We'll send you a link to your email.",
      link: { href: "/forgot-password", label: "Reset password" },
    }),
  },
  {
    name: "models_list",
    keywords: ["models", "view models", "see models", "browse models", "talents"],
    reply: (): ChatReply => ({
      text: "Browse our featured models and talents. You can filter by category and search.",
      link: { href: "/models", label: "View models" },
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
      "is the site down",
      "broken",
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

export const QUICK_OPTIONS = [
  "Apply as model",
  "View models",
  "Casting calls",
  "Dashboard",
  "Contact",
  "How it works",
  "Safety & Trust",
  "Report issue",
  "Marketplace",
  "About us",
];

const FALLBACK_REPLY: ChatReply = {
  text: "I can help with applying as a model, contact, dashboard, report an issue, how it works, safety, support, categories, directory, and more. Pick a quick option below or type your question.",
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
