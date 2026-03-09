# Migration Page Contents — All Page Copy & Structure for New Website

Use this file to migrate every page’s content (headings, form labels, buttons, static text) into a new site. Routes are under `app/`; each section below gives the route and the user-facing content to reuse.

---

## How to use

- **Route:** path relative to site root (e.g. `/signup`).
- **Copy:** headings, labels, placeholders, buttons, paragraphs.
- **Forms:** field names and labels so you can rebuild the same forms.
- **Data:** static arrays (e.g. case study titles) you can paste into the new CMS or code.

---

## 1. Home `/`

**Structure (order of sections):**
1. Loading screen (3s, spinner)
2. **JettonHero** (component)
3. **LatestWork** (component)
4. **TrendingModels** (component)
5. **AdSection** (component)
6. **ModelsSection**
7. **ElevateCareerSection**
8. **CampaignManagementSection**
9. **CreativeDirectorySection**
10. **TrendingCastings** (component)
11. **BrandCaseStudies**
12. **GetDiscovered**

**SEO H1 (visually hidden):**  
`Model Management Mauritius - Professional Modeling Platform for Models and Talent`

**ModelsSection**
- Heading: `Start your modeling journey now`
- Buttons: `I'm New to the spotlight` → `/discover-path/im-new-to-the-spotlight`, `I'm a full-time model` → `/discover-path/im-a-full-time-model`

**TalentsSection (Creative Directory)**
- Heading: `Creative Directory`
- Subheading: `Trun your talent into success` (note: typo “Trun” in original)
- Buttons: `I'm an influencer with a passion for creating`, `I'm a creative photographer`, `I'm a Stylist`, `I'm a talent Artist` → respective `/discover-path/...` routes

**ElevateCareerSection**
- Heading: `Build Your Modeling Career`
- Subheading: `Are you a model looking to refine your image and grow your opportunities? We're here to help.`
- Button: `Connect Now` → `/discover-path/were-more-than-a-brand`

**CampaignManagementSection**
- Heading: `Full-Service Campaign Management`
- Subheading: `Elevate Your Brand with Expert Campaign Solutions`
- Button: `Get Started` → `/discover-path/we-are-your-go-to-agency`

**CreativeDirectorySection (alternating)**
- Heading: `Creative Directory`
- Subheading: `Turn your talent into success`
- Buttons: same four talent links as above

**ElevateSection (scroll section)**
- Heading: `Elevate Your Modeling Career from Day One`
- Subheading: `Are you a model looking to refine your image and grow your opportunities? We're here to help.`
- Button: `Connect Now` → `/discover-path/were-more-than-a-brand`

**CampaignSection**
- Heading: `Full-Service Campaign Management`
- Subheading: `Elevate Your Brand with Expert Campaign Solutions`

**BrandCaseStudies**
- Section heading: `Case Studies`
- Cards: VIEW PROJECT (button)
- Case studies data:
  - id: `from-struggles-to-success`, title: `From Struggles to Success`, description: `How model management empowers every model`
  - id: `why-we-created-modelmanagement-mauritius`, title: `Why Modelmanagement.mu in Mauritius`, description: `Bridging the gap between local talent and global opportunities`
  - id: `all-faces-all-backgrounds`, title: `All Faces. All Backgrounds. One Platform.`, description: `Where Passion Matters More Than Perfection`

**GetDiscovered**
- Heading: `Get Discovered`
- Paragraph: `Join a variety of models and talents who found success through our platform`
- Buttons: `Sign up now` → `/signup`, `Get in Touch` → `/contact`

---

## 2. Auth pages

### 2.1 Signup `/signup`

**Create Your Account (form step)**
- H1: `Create Your Account`
- Sub: `Fill in your details to get started`
- Back: `Back to Home` → `/`
- Fields & labels:
  - Full Name — placeholder: `Enter your full name`
  - Email Address — placeholder: `Enter your email`
  - Phone Number — placeholder: `Enter your phone number`
  - Password — placeholder: `Create a password (min. 6 characters)`
  - Confirm Password
  - Agree to terms checkbox
- Submit: `Create Account`
- Error copy: “Please fill in all fields”, “Passwords do not match”, “Password must be at least 6 characters”, “Please agree to the terms and conditions”
- Link: `Sign in here` → `/login`

**Verify Your Email (OTP step)**
- H1: `Verify Your Email`
- Text: `We've sent a 6-digit verification code to {email}`
- Hint: `Can't find it? Check your spam / junk folder. The code expires in 10 minutes.`
- Label: `VERIFICATION CODE`
- Placeholder: `Enter 6-digit code`
- Buttons: `VERIFY EMAIL`, `Back to Form`
- Resend: `Didn't receive the code?` `RESEND CODE` / `RESEND IN {n}s`

### 2.2 Login `/login`

- H1: `Welcome Back`
- Sub: `Sign in to your account to continue`
- Labels: `Email Address`, `Password`
- Links: `Forgot your password?` → `/forgot-password`
- Submit: `Sign In`
- Loading: `Loading...`

### 2.3 Forgot password `/forgot-password`

- Email field; submit sends reset. Success: message that email was sent; link back to login.

### 2.4 Select role `/select-role`

- Heading: choose Model or Professional
- Sub: e.g. “Choose how you’ll use the platform”
- Buttons: Model, Professional
- Confirmation step before saving
- Loading: `Loading Role Selection` / `Please wait while we prepare your role selection...`
- Error: `Failed to select role. Please try again.`

### 2.5 Verification pending `/verification-pending`

- H1: `Account Under Review`
- Sub (pending): `Welcome to Model Management! Your {model|professional} account is being carefully reviewed by our team.`
- Sub (updated): `Thank you for updating your application! Your revised {model|professional} profile is being carefully reviewed by our team.`
- Section: `Review Progress` — `Estimated completion: {timeRemaining}`
- Steps: (1) Application Review — “Reviewing your profile information and documents” — In Progress; (2) Verification Process — “Verifying your credentials and background” — In Progress; (3) Account Activation — “Preparing your account access and permissions” — Pending
- Section: `We'll Be In Touch` (contact message)
- Sign out button

### 2.6 Rejected `/rejected`

- H1: `Application Rejected`
- Message: `Unfortunately, your {model|professional} application has been rejected by our admin team.`
- Box: `Common reasons for rejection:` — list: Incomplete or inaccurate information; Poor quality photos or portfolio; Not meeting our platform requirements; Inappropriate content or behavior
- Encouragement: `Don't worry! You can improve your application and reapply at any time.`
- Buttons: Sign Out, Reapply (or similar)

### 2.7 Revise application `/revise-application`

- Message that admin requested changes; CTA to edit application (e.g. go to become-model in revision mode).

### 2.8 Become model `/become-model`

- Long form: personal info, physical stats, categories, disciplines, portfolio uploads, social links. Copy all section titles and field labels from the form in `app/become-model/page.tsx` into your new site (too many fields to list here; use the component as reference).

### 2.9 Register (professional) `/register`

- Company, services, profile fields. Copy section titles and field labels from `app/register/page.tsx`.

---

## 3. Contact `/contact`

**Get in Touch**
- H2: `Get in Touch`
- Sub: `We'd love to hear from you. Send us a message and we'll respond as soon as possible.`
- Email Us: `info@modelmanagement.mu` — `We'll respond within 24 hours`
- Call Us: `+230 468 6969` — `Mon-Fri from 8am to 6pm`
- Visit Us: `2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene` — `Mauritius, 72201`
- Company: `Flash Communications Ltd`, address as above; Website: `www.theflashgroups.com`
- Follow Us: `Stay updated with our latest news and updates` — Instagram, TikTok, LinkedIn, Facebook links

**Form: Send Message**
- H1: `Send Message`
- Sub: `Fill out the form below and we'll get back to you`
- Fields: Full Name* (placeholder: Enter your full name), Email Address* (Enter your email address), Message* (Tell us how we can help you...)
- Submit: `Send Message` / `Sending Message...` / success state

---

## 4. Dashboard

### 4.1 Dashboard home `/dashboard`

- H1: `Welcome back` (+ optional `, Premium Member!`)
- Sub (model): `Ready to discover new opportunities and grow your modeling career?`
- Sub (professional): `Ready to find the perfect models for your next project?`
- Status pill: e.g. `Model: Approved` / `Professional: Pending`
- Sections: stats cards, quick actions (e.g. Apply to castings, Post casting, Update portfolio, View marketplace), recent activity
- Loading: `Loading Dashboard` / `Please wait while we prepare your dashboard...`

### 4.2 Account `/dashboard/account`

- H1: `Public information` (or similar for account hub)
- Tabs: Personal, Public, Notifications
- Public: “Upload your profile picture”, “Preview”, “Edit”, “Save”, “Cancel”

### 4.3 Other dashboard pages

- **Favorites** `/dashboard/favorites` — saved models/items
- **Casting Applications** `/dashboard/castingapp` — model applications list
- **My Castings** `/dashboard/my-castings` — professional’s castings
- **Post a Casting** `/dashboard/post-casting` — form: title, type, location, dates, payment, requirements, media
- **Bookings** `/dashboard/bookings`
- **Reviews** `/dashboard/reviews`
- **Payouts** `/dashboard/payouts`
- **My Marketplace** `/dashboard/mymarketplace` — create/edit offers
- **Subscription** `/dashboard/subscription`
- **Premium** `/dashboard/premium` — upgrade CTA
- **Update portfolio** `/dashboard/update-portfolio`
- **Boards** `/dashboard/boards`
- **Notifications** `/dashboard/notifications`
- **Followers** `/dashboard/followers`

---

## 5. Marketplace

### 5.1 Marketplace listing `/marketplace`

- Hero label: `Curated offers` (with star icon)
- H1: `Marketplace`
- Sub: `Professional services, photo sessions, and exclusive opportunities — discover what's next.`
- CTA (professional): `Post an offer` → `/dashboard/mymarketplace` or `Upgrade to post` → `/dashboard/premium`
- Empty state: `No offers yet` (with icon)

### 5.2 Offer detail `/marketplace/[id]`

- Dynamic: title, description, images, CTA from offer data.

---

## 6. Models

### 6.1 Models directory `/models`

- Metadata title: `Professional Models Directory | Model Management Mauritius`
- Description: `Browse 200+ verified professional models in Mauritius. Find fashion models, commercial models, runway models, and more. Connect directly with talented models for your projects.`
- Page: filters, grid, “Show more” / load more.

### 6.2 Model profile `/models/[id]`

- Dynamic: name, portfolio, bio, book/contact.

---

## 7. Professionals `/professionals`

- H1: `How can Model Management help you?`
- Sub: `Find the perfect talent for your projects with our comprehensive platform`
- Cards: Browse directory or create casting; Discover thousands of models; Directly connect or book online
- CTAs: `Create a Casting`, `Discover More`, `Reach Out`
- H2: `Why Model Management Mauritius?` — `Discover how you can benefit from our platform`
- Steps: All-in-One Platform, Cost-Effective, 1,500+ models
- Video section: `See Our Platform in Action` — Quick Setup, Secure Platform, Verified Models — `Start Your Journey` — `Join thousands of professionals already using our platform`
- H2: `Choose below to explore further!` — Photographer, Brand, Talent (signup links)
- H2: `The Fast Track to Top Talent` — `Register for free and discover how effective our platform is!`

---

## 8. Directory `/directory`

- Metadata and content as used in `app/directory/page.tsx` (premium directory).

---

## 9. Casting `/casting` and `/casting/[id]`

- List: filters, cards. Detail: title, type, location, dates, apply CTA. Copy from `app/casting/page.tsx` and `app/casting/[id]/page.tsx`.

---

## 10. Discover Path pages

Each has its own hero and body copy. Slugs and suggested titles:

| Slug | Title / theme |
|------|----------------|
| `im-new-to-the-spotlight` | Where new faces begin their modeling careers; how it works steps (Set Up Profile, Showcase Photos, Get Noticed, Start Your Journey) |
| `im-a-full-time-model` | Full-time model path |
| `were-more-than-a-brand` | We're more than a brand |
| `we-are-your-go-to-agency` | We are your go-to agency |
| `im-an-influencer-with-a-passion-for-creating` | Influencer / creating |
| `im-a-creative-photographer` | Creative photographer |
| `im-a-stylist` | Stylist |
| `im-a-talent-artist` | Talent artist |

**im-new-to-the-spotlight sample content:**
- H1: `Where new faces begin their modeling careers`
- How it works: 01 Set Up Your Profile — Sign up and create your modeling profile…; 02 Showcase Your Photos; 03 Get Noticed; 04 Start Your Journey
- Testimonials (names/quotes can be replaced): Sarah Johnson, Michael Chen, Emma Rodriguez
- Trusted brands block (Nike, H&M, etc. — use your own logos)

---

## 11. Case studies

### 11.1 Listing (on home)

- Section title: `Case Studies`
- Cards: title, description, button `VIEW PROJECT` → `/case-studies/{id}`

### 11.2 Case study pages

| Route | Title | Description (short) |
|-------|--------|----------------------|
| `/case-studies/from-struggles-to-success` | From Struggles to Success | How model management empowers every model |
| `/case-studies/why-we-created-modelmanagement-mauritius` | Why Modelmanagement.mu in Mauritius | Bridging the gap between local talent and global opportunities |
| `/case-studies/all-faces-all-backgrounds` | All Faces. All Backgrounds. One Platform. | Where Passion Matters More Than Perfection |

Copy full body from each `app/case-studies/[slug]/page.tsx` for migration.

---

## 12. Footer / legal / info pages

### 12.1 About Us `/footer/about-us`

- H1: `About Us` — Sub: `Transforming the Modeling Industry`
- Intro: Model Management Mauritius is an innovative online platform… Founded by Basant Lallah, Flash Communications Ltd…
- H2: `For Aspiring and Established Models` — paragraph on diversity, beginners to pros, influencers.
- H2: `For Clients and Industry Professionals` — photographers, brands, casting directors, agencies; paid jobs, collaborations, direct access to talent.
- Full-Service Campaign Management section (copy from page).

### 12.2 Other footer routes (copy from each file)

- `/footer/careers` — Careers
- `/footer/how-it-works` — How it works
- `/footer/how-it-works/models` — How it works for models
- `/footer/how-it-works/professionals` — How it works for professionals
- `/footer/terms-of-service` — Terms of Service
- `/footer/terms-of-service/models` — Terms for models
- `/footer/terms-of-service/professionals` — Terms for professionals
- `/footer/terms-of-service/agencies` — Terms for agencies
- `/footer/terms-of-service/agents` — Terms for agents
- `/footer/privacy-policy` — Privacy Policy
- `/footer/support` — Support
- `/footer/press` — Press
- `/footer/blog` — Blog listing
- `/footer/blog/ai-digital-revolution` — AI / digital revolution
- `/footer/blog/the-pulse-of-change-fashion-evolution` — Fashion evolution
- `/footer/blog/diversity-representation` — Diversity & representation
- `/footer/modelling-advice` — Modelling advice hub
- `/footer/modelling-advice/glossary` — Glossary
- `/footer/modelling-advice/discover-confidence` — Discover confidence
- `/footer/modelling-advice/practical-tips` — Practical tips
- `/footer/modelling-advice/build-portfolio` — Build portfolio
- `/footer/modelling-advice/best-shoots` — Best shoots
- `/footer/modelling-advice/model-academies` — Model academies
- `/footer/modelling-advice/self-photography` — Self photography
- `/footer/modelling-advice/aspiring-models` — Aspiring models
- `/footer/modelling-advice/real-model` — Real model
- `/footer/modelling-advice/modeling-workshops` — Modeling workshops
- `/footer/safety-and-trust` — Safety and trust
- `/footer/safety-and-trust/what-you-should-know` — What you should know
- `/footer/safety-and-trust/scamming-examples` — Scamming examples
- `/footer/safety-and-trust/avoid-scammers` — Avoid scammers
- `/footer/safety-and-trust/code-of-conduct` — Code of conduct

---

## 13. Payment & checkout

### 13.1 Checkout `/checkout`

- Checkout form and plan selection (copy from `app/checkout/page.tsx`).

### 13.2 Payment success `/payment/success`

- Thank-you message; order/plan confirmation.

### 13.3 Payment cancelled `/payment/cancelled`

- Message that payment was cancelled.

### 13.4 Payment rejected `/payment/rejected`

- H1: `Payment Authorization Unsuccessful`
- Message: `Your purchase will not be completed with the card that was declined.`
- Transaction details: Order ID, Amount, Status: Rejected, Date, Reason
- H3: `Accepted Payment Methods`
- H3: `Common reasons for payment rejection:` — Insufficient funds; Card expired or invalid; Spending limit exceeded; Card issuer blocked transaction; Incorrect card details; Card not enabled for online
- Need Help: Email info@modelmanagement.mu, Phone +230 468 6969, Hours Mon-Fri 8AM-6PM

---

## 14. Admin

### 14.1 Admin login `/admin/login`

- Admin email/password form; verify against admin list.

### 14.2 Admin panel `/admin`

- H2: `Admin Panel` — Welcome, {email}
- Cards: Premium Users, Payment Verifications, View Site, Sign Out
- Stats: Total Users, Pending Approvals, Total Models, Total Professionals, Availability Requests, Pending Availability Checks, Marketplace Offers, Pending Marketplace Approvals
- Quick Actions: Approve Users, Manage Castings
- Tabs: Users, Models, Professionals, Castings — table headers: User/Model/Professional, Email, Role/Company, Status, Joined/Registration Date, Actions; filters: All Status (Pending, Changes Requested, Updated, Approved, Rejected), All Roles (Models, Professionals), All Profiles (Complete, Incomplete)
- Copy all table headers and filter options from `app/admin/page.tsx`.

### 14.3 Other admin routes

- `/admin/details/[type]/[id]` — View/edit user or casting or model
- `/admin/marketplace` — Moderate marketplace offers
- `/admin/premium-users` — Premium users list / export
- `/admin/bank-transfers` — H1: `Payment Verifications` — Sub: `Review and approve bank transfer & Juice payments`; Review Payment, Payment Information (User, Email, Plan, Amount, Payment Method), Payment Proof, Admin Notes

---

## 15. Other routes (brief)

| Route | Content summary |
|-------|------------------|
| `/profile` | Redirect or current user profile |
| `/profile/[id]` | Public profile (model or user) |
| `/report` | Report form (user/content) — labels and copy in `app/report/page.tsx` |
| `/company-details` | Company info page |
| `/sponsor` | Partners / sponsors |
| `/event-booking` | Event booking form |
| `/direct-booking/[id]` | H1: Direct Booking Details — Project, Status, Project Title, Location, Duration/Type, Compensation, Scheduled Date, Request Date, Professional, Model, timeline (Request Submitted, Scheduled Project Date) |
| `/premium/coming-soon` | Premium coming soon |
| `/modelsTalents` | Models + talents landing |
| `/control-panel` | Control panel (if used) |
| `/test-discover-path` | Test discover path |

---

## 16. Full route list (106 pages)

Use this list to ensure no route is missed when migrating:

```
/                           (home)
/signup
/login
/forgot-password
/select-role
/become-model
/register
/verification-pending
/revise-application
/rejected
/contact
/report
/company-details
/sponsor
/event-booking
/models
/models/[id]
/modelsTalents
/directory
/casting
/casting/[id]
/marketplace
/marketplace/[id]
/professionals
/professionals/[id]
/profile
/profile/[id]
/checkout
/payment/success
/payment/cancelled
/payment/rejected
/premium/coming-soon
/direct-booking/[id]
/control-panel
/test-discover-path
/dashboard
/dashboard/account
/dashboard/account/personal
/dashboard/account/public
/dashboard/account/notifications
/dashboard/favorites
/dashboard/castingapp
/dashboard/my-castings
/dashboard/post-casting
/dashboard/bookings
/dashboard/reviews
/dashboard/payouts
/dashboard/mymarketplace
/dashboard/subscription
/dashboard/premium
/dashboard/premium/launch-promotion
/dashboard/upgrade
/dashboard/update-portfolio
/dashboard/boards
/dashboard/notifications
/dashboard/followers
/admin
/admin/login
/admin/details/[type]/[id]
/admin/marketplace
/admin/premium-users
/admin/bank-transfers
/discover-path/im-new-to-the-spotlight
/discover-path/im-a-full-time-model
/discover-path/were-more-than-a-brand
/discover-path/we-are-your-go-to-agency
/discover-path/im-an-influencer-with-a-passion-for-creating
/discover-path/im-a-creative-photographer
/discover-path/im-a-stylist
/discover-path/im-a-talent-artist
/case-studies/from-struggles-to-success
/case-studies/why-we-created-modelmanagement-mauritius
/case-studies/all-faces-all-backgrounds
/footer/about-us
/footer/careers
/footer/how-it-works
/footer/how-it-works/models
/footer/how-it-works/professionals
/footer/terms-of-service
/footer/terms-of-service/models
/footer/terms-of-service/professionals
/footer/terms-of-service/agencies
/footer/terms-of-service/agents
/footer/privacy-policy
/footer/support
/footer/press
/footer/blog
/footer/blog/ai-digital-revolution
/footer/blog/the-pulse-of-change-fashion-evolution
/footer/blog/diversity-representation
/footer/modelling-advice
/footer/modelling-advice/glossary
/footer/modelling-advice/discover-confidence
/footer/modelling-advice/practical-tips
/footer/modelling-advice/build-portfolio
/footer/modelling-advice/best-shoots
/footer/modelling-advice/model-academies
/footer/modelling-advice/self-photography
/footer/modelling-advice/aspiring-models
/footer/modelling-advice/real-model
/footer/modelling-advice/modeling-workshops
/footer/safety-and-trust
/footer/safety-and-trust/what-you-should-know
/footer/safety-and-trust/scamming-examples
/footer/safety-and-trust/avoid-scammers
/footer/safety-and-trust/code-of-conduct
```

---

## 17. Assets and data references

- **Images:** `/images/` — logo (`/images/logo/logomain.png`), campaign, talent, case-studies, model_section (videos), flash, brands, categories.
- **Firestore:** users, models, castings, casting-applications, marketplace, likes, reviews, bookings, notifications (see WEBSITE_WORKING_PLAN.md).
- **API:** `/api/contact`, `/api/admin/check-email`, and other endpoints used by forms.

For full flows, auth rules, and dashboard structure, use **WEBSITE_WORKING_PLAN.md** together with this file.
