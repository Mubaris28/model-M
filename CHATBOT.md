# Help Chatbot – Details & Contents

## Overview

The **Help Chatbot** is a rule-based, in-app assistant for Model Management Mauritius. It appears as a floating action button (FAB) on the bottom-left of every page and opens a chat panel where users can type questions or use quick-option shortcuts. The bot matches intents from user text and returns predefined replies with optional links to pages.

---

## Files

| Purpose | Path |
|--------|-----|
| **UI component** (React/TSX) | `src/components/Chatbot.tsx` |
| **Logic & intents** (TypeScript) | `src/lib/chatbot.ts` |
| **Layout** (where it’s mounted) | `src/app/layout.tsx` – `<Chatbot />` in the root layout |
| **Typing animation** | `src/app/globals.css` – `.chat-typing-dot` keyframes |

---

## How It Works

### 1. Opening the chat

- A **floating button** (FAB) is fixed at bottom-left (`bottom-6 left-4`, with safe-area insets).
- Clicking it sets `open` to `true`, which shows the chat panel and hides the FAB.
- The panel opens with a short scale + slide animation (Framer Motion).

### 2. Sending a message

- User can **type** in the input and press Enter or click **Send**, or **click a quick-option** chip.
- The message is added to the `messages` array with `role: "user"`.
- `loading` is set to `true`; a **typing indicator** (three animated dots) is shown.
- After a short delay (`TYPING_DELAY_MS = 400`), the app calls **`getReply(message)`** from `@/lib/chatbot`.

### 3. Getting a reply (`src/lib/chatbot.ts`)

- User text is **normalized** (lowercase, trimmed, collapsed spaces).
- **Intents** are checked in order. Each intent has:
  - **name**: e.g. `greeting`, `become_model`, `contact`
  - **keywords**: phrases that trigger it (e.g. `"apply"`, `"apply as model"`)
  - **reply**: function returning `{ text, link?, gifUrl? }`
- **First matching intent** wins. Its `reply()` is called (can be async for e.g. site status).
- If no intent matches, a **fallback** reply is returned suggesting quick options.
- **Site status** is special: it can match from keywords and then calls `checkHealth()` (GET `/api/health` or `NEXT_PUBLIC_API_URL/api/health`) to decide the message.

### 4. Showing the reply

- The returned `text` (and optional `link`, `gifUrl`) is appended as a **bot message**.
- `loading` is set to `false`.
- The message list scrolls to the bottom.
- **Quick options** are shown when there are no messages or the last message is from the bot (and not loading).

### 5. Closing the chat

- User clicks the **X** in the header; `open` becomes `false`, panel animates out, FAB appears again.
- **Tab** focus is trapped inside the panel while open; first/last focusable elements wrap.

---

## UI Contents (Chatbot.tsx)

### Quick options (chips)

Shown when the chat is empty or the last message is from the bot:

1. Apply as model  
2. Contact  
3. Dashboard  
4. Is the site working?  
5. How it works  
6. Report issue  
7. View models  
8. Safety & Trust  

Clicking a chip sends that exact text and triggers the matching intent.

### Welcome state (no messages yet)

- A **welcome GIF** (wave animation from Giphy), 16×16 rounded container.  
  - URL: `https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif`  
  - If the image fails to load, it is hidden and only text is shown.
- **Title**: “Hi! How can I help you today?”
- **Subtitle**: “Choose a quick option or type your question.”

### Message bubbles

- **User**: right-aligned, primary colour, rounded bubble with `rounded-br-md`.
- **Bot**: left-aligned, muted background, rounded bubble with `rounded-bl-md`.
- Each message can have:
  - **Text** (required)
  - **Link** (optional): button/link below text, e.g. “Go to dashboard” → navigates and can close the panel.
  - **GIF** (optional): `gifUrl` shown as a small image above the text in the bot bubble.

### Typing indicator

- Three dots with the CSS class `chat-typing-dot` (see `globals.css`).
- Animation: `chat-dot` keyframe (bounce/opacity), with staggered delays for each dot.

### Header

- Title: **“Help”**.
- Close button: **X** icon, hover/tap scale animation.

### Input area

- **Text input**: placeholder “Type a message...”, rounded, focus ring.
- **Send button**: primary (red) colour, paper-plane icon, disabled when empty or loading.  
- Hover/tap scale on the send button.

### FAB (when panel is closed)

- **Style**: White/card background, **black border** (`border-2 border-foreground`), **black icon** (MessageCircle from Lucide).
- **Size**: 56×56px (`h-14 w-14`).
- **Position**: Fixed bottom-left, with safe-area insets.
- **Animation**: Spring on first appearance; hover scale up, tap scale down.

---

## Intents & Replies (chatbot.ts)

All intents are in the `INTENTS` array. Order matters: first match wins.

| Intent name       | Example keywords | Reply summary | Link (if any) |
|-------------------|------------------|---------------|----------------|
| `greeting`        | hi, hello, hey, good morning/afternoon/evening | Intro + what the bot can help with | — |
| `become_model`    | apply, apply as model, become a model, join, register as model, how to apply, i want to be a model | Apply through application process | `/become-model` – “Go to Become a model” |
| `contact`        | contact, email, support, help, get in touch, reach | Contact form | `/contact` – “Open contact form” |
| `dashboard`      | dashboard, my account, profile, my profile, account | Dashboard for profile, castings, bookings | `/dashboard` – “Go to dashboard” |
| `login_signup`   | login, log in, sign in, sign up, signup, register | Log in or create account | `/login` – “Log in” |
| `casting`        | casting, castings, jobs, opportunities, audition | Browse castings | `/casting` – “View castings” |
| `marketplace`    | marketplace, shop, market | Talent/services marketplace | `/marketplace` – “Open marketplace” |
| `about`          | about, who are you, what is this, company, platform | Model Management Mauritius intro | `/about` – “Learn more” |
| `report`         | report, report issue, report a problem, complaint, report bug, report abuse | Report form | `/report` – “Report an issue” |
| `how_it_works`   | how it works, how does it work, process, getting started | How the platform works | `/footer/how-it-works` – “How it works” |
| `safety`         | safety, trust, safe, safety and trust, safety & trust, secure, verification | Safety & trust info | `/footer/safety-and-trust` – “Safety & Trust” |
| `support`        | support, help centre, faq, faqs, frequently asked | Support/FAQs | `/footer/support` – “Support” |
| `modelling_advice` | modelling advice, modeling advice, advice, tips for models, career advice | Modelling advice | `/footer/modelling-advice` – “Modelling advice” |
| `careers`        | career, careers, jobs, work with us, hiring | Careers page | `/career` – “Careers” |
| `professionals`  | professional, professionals, photographer, agency, brand, client | For professionals | `/professionals` – “For professionals” |
| `categories`     | categories, category, types of models, model types | Browse by category | `/categories` – “View categories” |
| `directory`      | directory, model directory, find models, search models | Directory | `/directory` – “Open directory” |
| `sponsor`        | sponsor, sponsorship, partner, partners | Sponsorship/partners | `/sponsor` – “Sponsor / Partners” |
| `forgot_password`| forgot password, reset password, password reset, lost password | Reset via email | `/forgot-password` – “Reset password” |
| `models_list`    | models, view models, see models, browse models, talents | Featured models/talents | `/models` – “View models” |
| `site_status`    | is the site working, site working, site down, status, is site up, website working, server, broken | **Async**: calls `checkHealth()` and returns “site is running” or “trouble reaching server” + contact link | `/contact` – “Contact us” (only when server unreachable) |

There is an extra **loose site-status** check: if the user message contains any of `working`, `down`, `up`, `status`, `broken`, `error` **and** any of `site`, `web`, `server`, the health check is run and the same site-status replies are used.

### Fallback (no intent matched)

- **Text**: “I can help with applying as a model, contact, dashboard, report an issue, how it works, safety, support, categories, directory, and more. Pick a quick option below or type your question.”

### Empty message

- If the user sends an empty string (after trim), the reply is: “Type a message or pick one of the quick options to get started.”

---

## Reply shape (`ChatReply`)

```ts
type ChatReply = {
  text: string;                              // Required
  link?: { href: string; label: string };     // Optional CTA
  gifUrl?: string;                           // Optional image/GIF in bot bubble
};
```

The UI supports all three. Currently no intent sets `gifUrl`; the only GIF is the fixed welcome image in the component.

---

## Animations (Framer Motion)

- **Panel**: open/close – opacity, y, scale.
- **User message**: from right (x: 20 → 0), scale 0.96 → 1.
- **Bot message**: from left (x: -20 → 0), scale 0.96 → 1.
- **Quick option chips**: staggered opacity/y; hover scale 1.03, tap 0.98.
- **Send button**: hover 1.05, tap 0.95.
- **Close button**: hover 1.1, tap 0.9.
- **FAB**: spring on mount; hover 1.08, tap 0.95.

---

## Accessibility & behaviour

- **Dialog**: `role="dialog"`, `aria-label="Help chat"`.
- **Buttons**: `aria-label` for close, send, and open chat.
- **Focus**: When the panel opens, focus moves into it; **Tab** is trapped (wraps from last to first and vice versa).
- **Safe area**: `env(safe-area-inset-bottom)` and `env(safe-area-inset-left)` used for FAB and panel so they sit above notches/home indicators on devices.

---

## Summary

- **Component**: `src/components/Chatbot.tsx` – UI, state, and animations.
- **Logic**: `src/lib/chatbot.ts` – intents, keywords, replies, health check, and `getReply()`.
- **Contents**: Welcome GIF + greeting, 8 quick-option chips, user/bot bubbles (with optional link and `gifUrl`), typing indicator, and input + send button.
- **Behaviour**: Rule-based intent matching; all shortcuts and common phrasings above are handled; site status is the only async intent (health check).
