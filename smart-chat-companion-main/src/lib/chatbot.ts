export type ChatReply = {
  text: string;
  link?: { href: string; label: string };
  gifUrl?: string;
};

type Intent = {
  name: string;
  keywords: string[];
  reply: () => ChatReply | Promise<ChatReply>;
};

const INTENTS: Intent[] = [
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "sup", "yo"],
    reply: () => ({
      text: "Hey there! 👋 I'm your Model Management Mauritius assistant. I can help you apply as a model, find castings, navigate the platform, and more. What would you like to do?",
    }),
  },
  {
    name: "become_model",
    keywords: ["apply", "apply as model", "become a model", "join", "register as model", "how to apply", "i want to be a model", "sign up as model"],
    reply: () => ({
      text: "Great choice! You can apply through our simple application process. We'll guide you through creating your portfolio and profile.",
      link: { href: "/become-model", label: "Go to Become a model" },
    }),
  },
  {
    name: "contact",
    keywords: ["contact", "email", "support", "help", "get in touch", "reach", "phone", "call"],
    reply: () => ({
      text: "You can reach us through our contact form. We typically respond within 24 hours.",
      link: { href: "/contact", label: "Open contact form" },
    }),
  },
  {
    name: "dashboard",
    keywords: ["dashboard", "my account", "profile", "my profile", "account"],
    reply: () => ({
      text: "Your dashboard is where you manage your profile, view castings, and track bookings.",
      link: { href: "/dashboard", label: "Go to dashboard" },
    }),
  },
  {
    name: "login_signup",
    keywords: ["login", "log in", "sign in", "sign up", "signup", "register"],
    reply: () => ({
      text: "You can log in to your existing account or create a new one to get started.",
      link: { href: "/login", label: "Log in" },
    }),
  },
  {
    name: "casting",
    keywords: ["casting", "castings", "jobs", "opportunities", "audition", "gigs"],
    reply: () => ({
      text: "Browse available castings and find opportunities that match your profile.",
      link: { href: "/casting", label: "View castings" },
    }),
  },
  {
    name: "marketplace",
    keywords: ["marketplace", "shop", "market"],
    reply: () => ({
      text: "Our marketplace connects talent with services. Explore what's available!",
      link: { href: "/marketplace", label: "Open marketplace" },
    }),
  },
  {
    name: "about",
    keywords: ["about", "who are you", "what is this", "company", "platform"],
    reply: () => ({
      text: "Model Management Mauritius is a platform connecting models, photographers, and brands across Mauritius and beyond.",
      link: { href: "/about", label: "Learn more" },
    }),
  },
  {
    name: "report",
    keywords: ["report", "report issue", "report a problem", "complaint", "report bug", "report abuse"],
    reply: () => ({
      text: "We take all reports seriously. Please use our report form to describe the issue.",
      link: { href: "/report", label: "Report an issue" },
    }),
  },
  {
    name: "how_it_works",
    keywords: ["how it works", "how does it work", "process", "getting started"],
    reply: () => ({
      text: "Our platform makes it easy: create a profile, browse opportunities, apply to castings, and get booked. Simple!",
      link: { href: "/footer/how-it-works", label: "How it works" },
    }),
  },
  {
    name: "safety",
    keywords: ["safety", "trust", "safe", "safety and trust", "safety & trust", "secure", "verification"],
    reply: () => ({
      text: "Your safety is our top priority. We verify all users and have strict community guidelines in place.",
      link: { href: "/footer/safety-and-trust", label: "Safety & Trust" },
    }),
  },
  {
    name: "support",
    keywords: ["support", "help centre", "faq", "faqs", "frequently asked"],
    reply: () => ({
      text: "Check out our support page for FAQs and detailed guides.",
      link: { href: "/footer/support", label: "Support" },
    }),
  },
  {
    name: "modelling_advice",
    keywords: ["modelling advice", "modeling advice", "advice", "tips for models", "career advice"],
    reply: () => ({
      text: "Looking for tips? We have resources to help you grow your modelling career.",
      link: { href: "/footer/modelling-advice", label: "Modelling advice" },
    }),
  },
  {
    name: "careers",
    keywords: ["career", "careers", "work with us", "hiring"],
    reply: () => ({
      text: "Interested in joining our team? Check out open positions.",
      link: { href: "/career", label: "Careers" },
    }),
  },
  {
    name: "professionals",
    keywords: ["professional", "professionals", "photographer", "agency", "brand", "client"],
    reply: () => ({
      text: "Are you a photographer, agency, or brand? We have tools designed just for you.",
      link: { href: "/professionals", label: "For professionals" },
    }),
  },
  {
    name: "categories",
    keywords: ["categories", "category", "types of models", "model types"],
    reply: () => ({
      text: "Browse models by category — fashion, commercial, fitness, and more.",
      link: { href: "/categories", label: "View categories" },
    }),
  },
  {
    name: "directory",
    keywords: ["directory", "model directory", "find models", "search models"],
    reply: () => ({
      text: "Use our directory to find and connect with models.",
      link: { href: "/directory", label: "Open directory" },
    }),
  },
  {
    name: "sponsor",
    keywords: ["sponsor", "sponsorship", "partner", "partners"],
    reply: () => ({
      text: "Interested in sponsoring or partnering with us? Let's talk!",
      link: { href: "/sponsor", label: "Sponsor / Partners" },
    }),
  },
  {
    name: "forgot_password",
    keywords: ["forgot password", "reset password", "password reset", "lost password"],
    reply: () => ({
      text: "No worries! You can reset your password via email.",
      link: { href: "/forgot-password", label: "Reset password" },
    }),
  },
  {
    name: "models_list",
    keywords: ["models", "view models", "see models", "browse models", "talents"],
    reply: () => ({
      text: "Discover our featured models and talented individuals.",
      link: { href: "/models", label: "View models" },
    }),
  },
  {
    name: "site_status",
    keywords: ["is the site working", "site working", "site down", "status", "is site up", "website working", "server", "broken"],
    reply: async () => {
      const isUp = await checkHealth();
      if (isUp) {
        return { text: "✅ The site is running smoothly! Everything looks good." };
      }
      return {
        text: "⚠️ We're having some trouble reaching the server. Please try again later or contact us.",
        link: { href: "/contact", label: "Contact us" },
      };
    },
  },
];

const SITE_STATUS_WORDS = ["working", "down", "up", "status", "broken", "error"];
const SITE_CONTEXT_WORDS = ["site", "web", "server"];

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/health", { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export const QUICK_OPTIONS = [
  "Apply as model",
  "Contact",
  "Dashboard",
  "Is the site working?",
  "How it works",
  "Report issue",
  "View models",
  "Safety & Trust",
];

export async function getReply(message: string): Promise<ChatReply> {
  const input = normalize(message);

  if (!input) {
    return { text: "Type a message or pick one of the quick options to get started." };
  }

  // Check intents in order
  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => input.includes(kw))) {
      return intent.reply();
    }
  }

  // Loose site-status check
  const hasSiteWord = SITE_STATUS_WORDS.some((w) => input.includes(w));
  const hasContextWord = SITE_CONTEXT_WORDS.some((w) => input.includes(w));
  if (hasSiteWord && hasContextWord) {
    const statusIntent = INTENTS.find((i) => i.name === "site_status");
    if (statusIntent) return statusIntent.reply();
  }

  // Fallback
  return {
    text: "I can help with applying as a model, contact, dashboard, report an issue, how it works, safety, support, categories, directory, and more. Pick a quick option below or type your question.",
  };
}
