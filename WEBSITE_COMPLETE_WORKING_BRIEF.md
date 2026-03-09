# Website Complete Working Brief — Forms, Dashboard, Admin, Workflows

Single reference for replicating this site elsewhere: **post-signup forms**, **all forms and workflows**, **dashboard sections/features**, **admin sections/features**, and **minute-by-minute behaviour** (e.g. after sign-in the home is the dashboard).

---

## Part 1: After sign-in — home = dashboard

- **Logged-in users** do not land on the public home page (`/`). AuthContext redirects them to the **dashboard** (`/dashboard`) or another required step (select-role, become-model, register, verification-pending, revise-application, rejected).
- So for an **approved** user, **“home”** after sign-in is **`/dashboard`** (Dashboard home with welcome, stats, quick actions, recent castings, messages, bookings).
- Public home (`/`) is only for **guests** or when not logged in.

---

## Part 2: Forms after signup (brief + same structure for replication)

### 2.1 Select role (`/select-role`)

**When:** Right after signup; user has `role: 'user'`.  
**Purpose:** Choose Model or Professional; writes to `users/{uid}` → `role: 'model' | 'professional'`.  
**Workflow:** Choose card → Confirm → `updateDoc` → `refreshUserProfile` → AuthContext redirects to become-model or register.

**Sections / UI:**
- **Header:** “Choose Your Path” — “Select your account type to continue with your registration”
- **Two role cards:**
  - **I'm a Model** — “Create your portfolio, apply for castings, and showcase your talent” — bullets: Create stunning portfolio, Apply for casting calls, Connect with agencies, Manage bookings
  - **I'm a Professional** — “Post castings, discover talent, and manage your creative projects” — bullets: Post casting calls, Browse model profiles, Manage applications, Build your network
- **Confirmation step:** “Confirm Your Choice” — “You selected: **Model** | **Professional**” — Buttons: “Go Back”, “Confirm & Continue” (loading: “Setting up...”)
- **Optional:** “Change Role Selection” (resets role to `user`, `hasCompletedRegistration: false`) if user already had a role

**Form fields:** None (only two buttons + confirmation).  
**Data written:** `users/{uid}`: `role`, `updatedAt`.

---

### 2.2 Become model (`/become-model`) — two-step form

**When:** After select-role when user chose Model.  
**Purpose:** Full model application; sets `hasCompletedRegistration: true`, `status: 'pending'` (or revision).  
**Workflow:** Step 1 → save progress to `models` (draft) → Step 2 (verification) → submit → redirect to verification-pending (or dashboard if revision).

**Step indicator:** Step 1 — Step 2 (active/completed states).

**Step 1 — Sections and fields:**

1. **Personal Information** *(required)*  
   - First name, Last name, Email (prefilled), Phone, Date of birth, Gender, Nationality, Ethnicity, Location/Address.  
   - **Languages Spoken** *(required)* — multi-select.  
   - Sub-section: Phone Number.

2. **Physical Measurements** *(required)*  
   - Height (cm), Weight (kg), Chest/Bust, Waist, Hips, Dress size, Shoe size, Eye color, Hair color, Body type.

3. **Modeling Disciplines** *(required)*  
   - Multi-select: e.g. Runway, Commercial, Editorial, Fitness, etc.

4. **Categories** *(required)*  
   - Multi-select: e.g. Fashion, Swimwear, Lingerie, etc.

5. **Social Media Presence** *(required — at least one)*  
   - Instagram, TikTok, Twitter; optional “Other social media” + URL/handle.

6. **Portfolio Images** *(required)*  
   - 4–6 images; accept JPEG, JPG, PNG, WebP.  
   - Upload area, preview grid, remove per image.  
   - Validation: min 4, max 6.

**Step 1 buttons:** “Back to Role Selection” (or “Back to Step 1” when on Step 2), “Continue to Verification” (loading: “Saving Progress...”).  
**Disclaimer:** “After clicking continue, your progress will be saved and you'll be able to upload your verification documents.” “You can complete the verification step later - your progress is automatically saved.”

**Step 2 — Sections and fields:**

1. **Identity Verification** *(required)*  
   - **ID/Passport Number** — text.  
   - **ID/Passport Photo** — single image upload (JPEG/JPG/PNG/WebP).  
   - Privacy message: “Your Privacy & Safety Matter” — bullets (used only for verification, stored securely, not shared, etc.) + link to Privacy Policy.

2. **Selfie with ID** *(required)*  
   - One image: selfie holding ID.

**Step 2 buttons:** “Back to Step 1”, “Submit Application” (loading state).  
**Data written:** Firestore `models` (and `users` flags), Storage for portfolio + ID + selfie. On full submit: `hasCompletedRegistration: true`, `status: 'pending'` (or `'updated'` in revision).

---

### 2.3 Register professional (`/register`)

**When:** After select-role when user chose Professional.  
**Purpose:** Complete professional profile; sets `hasCompletedRegistration: true`.  
**Workflow:** Fill form → submit → `completeUserRegistration` → redirect (e.g. verification-pending or dashboard per your logic).

**Sections (typical):**  
- Company/Business name, Type (e.g. Photographer, Brand, Agency), BRN (optional), Website.  
- Services offered, Location, Contact (phone, email).  
- Profile/description, logo or work photos (if applicable).  
- Same kind of enhanced dropdowns and inputs as become-model (searchable dropdowns, floating labels).  

**Data written:** `users/{uid}` and possibly `professionals/{uid}` (or embedded in users).  
Use `app/register/page.tsx` for exact field names and section titles when replicating.

---

### 2.4 Verification pending (`/verification-pending`)

**When:** User has `hasCompletedRegistration: true` and `status: 'pending' | 'updated'`.  
**Not a form.**  
**Body:** “Account Under Review”, “Review Progress” (3 steps: Application Review, Verification Process, Account Activation), “We'll Be In Touch”, Sign out.  
**Workflow:** User waits; admin approves/rejects → AuthContext redirects to dashboard or rejected/revise.

---

### 2.5 Revise application (`/revise-application`)

**When:** `status === 'changesRequested'`.  
**Not a form.**  
**Body:** Message that admin requested changes; CTA to edit application (e.g. “Go to application” → `/become-model?mode=revision` for models).  
**Workflow:** User completes edits and resubmits → status can become `updated` → redirect to verification-pending.

---

### 2.6 Rejected (`/rejected`)

**When:** `status === 'rejected'`.  
**Not a form.**  
**Body:** “Application Rejected”, reasons list, “Reapply” / Sign out.  
**Workflow:** User can sign out or reapply (if you implement reapply, e.g. reset status and send back to become-model/register).

---

## Part 3: All forms in the site (sections, fields, workflow)

### 3.1 Signup (`/signup`)

- **Sections:** (1) Create account form (2) Optional: Verify email (OTP).
- **Fields:** Full name, Email, Phone, Password, Confirm password, Agree to terms (checkbox).
- **Workflow:** Submit → optional SignupChecklistModal → create user + `users` doc (role `user`) → send OTP → verify OTP (or skip if no OTP step) → redirect to select-role.
- **Validation:** All required; password ≥ 6; passwords match; terms agreed.
- **Errors:** “Please fill in all fields”, “Passwords do not match”, “Password must be at least 6 characters”, “Please agree to the terms and conditions”, “Sign in here” link if already exists.

### 3.2 Login (`/login`)

- **Fields:** Email, Password.
- **Workflow:** Optional admin check → if admin, redirect to `/admin/login`; else Firebase sign-in → AuthContext loads profile → redirect by status (select-role, become-model, register, verification-pending, revise, rejected, dashboard).
- **Links:** “Forgot your password?” → `/forgot-password`.

### 3.3 Forgot password (`/forgot-password`)

- **Fields:** Email.
- **Workflow:** Submit → Firebase `sendPasswordResetEmail` → success message; link back to login.

### 3.4 Contact (`/contact`)

- **Sections:** Get in Touch (info) + Send Message (form).
- **Fields:** Full name*, Email*, Message*.
- **Workflow:** POST `/api/contact` → success/error message.

### 3.5 Post casting (`/dashboard/post-casting`) — professionals only

- **Sections (and main fields):**
  1. **Casting type** — Paid Shoot | Collaborative Shoot | Content Creation (cards).
  2. **Basics** — Title, Description.
  3. **Location & timeline** — Location (dropdown: Mauritius districts + cities + international), Custom location (if Other), Is remote (checkbox), Shoot date, Application deadline, Duration.
  4. **Payment** — Is paid (checkbox), Amount, Currency (e.g. MUR), Payment type (hourly/daily/project), Additional compensation.
  5. **Model requirements** — Gender (multi), Age min/max, Height min/max, Ethnicities (multi), Experience (dropdown), Special requirements.
  6. **Wardrobe & styling** — Wardrobe provided, Wardrobe details, Makeup provided, Makeup details.
  7. **Other** — Number of models, Travel required, Accommodation/meal provided, Additional perks, Application instructions, Portfolio required, Contact email/phone, Usage rights, Contract details, Nudity level (e.g. none).
- **Workflow:** Submit → `createCasting` (Firestore) + optional media upload → success → redirect or stay.
- **Data:** Saved to `castings` with `approvalStatus: 'pending'` (admin approves later).

### 3.6 Marketplace offer (Post offer modal — `/dashboard/mymarketplace`)

- **Sections:**
  1. **Basic** — Title, Phone, Email, Description.
  2. **Social media & website (optional)** — Website, Instagram, Facebook, TikTok, LinkedIn, Twitter (URLs).
  3. **Photos** — Upload up to 6 images.
- **Workflow:** Professionals only; premium required; submit → create offer (Firestore `marketplace`) → status pending until admin approves.
- **Access:** “Post New Offer” opens modal; non‑premium sees “Premium Feature” and “Upgrade to Premium”.

### 3.7 Account — Personal (`/dashboard/account`, tab Personal)

- **Sections:** Personal info (name, email, phone, DOB, location, etc.); optional sub-sections by role (model measurements, professional company).
- **Workflow:** Edit fields → Save → update Firestore (`users` / `models` / `professionals`). Real-time listener can update UI.

### 3.8 Account — Public (`/dashboard/account`, tab Public)

- **Sections:** Public profile (what others see): profile picture upload, bio, location, country dropdown, etc.
- **Workflow:** Edit → Save per section or global Save/Cancel.

### 3.9 Account — Notifications (`/dashboard/account`, tab Notifications)

- **Sections:** Notification preferences (email, in-app, etc.).
- **Workflow:** Toggle/save preferences to user doc.

### 3.10 Report (`/report`)

- **Sections:** Report type, Reported user/content, Description/reason.
- **Workflow:** Submit → e.g. `user-reports` or API → thank-you message.

### 3.11 Admin login (`/admin/login`)

- **Fields:** Email, Password.
- **Workflow:** Sign in → POST `/api/auth/session` (idToken, isAdmin: true) → POST `/api/auth/check-status` → redirect to `/admin`.

---

## Part 4: Dashboard — all sections and features

**Layout:** Sidebar (collapsible, mobile menu) + main content. Sidebar: profile/avatar (optional upload), then nav links.

**After sign-in, approved users land here; “home” = dashboard home.**

### 4.1 Dashboard home (`/dashboard`)

- **Welcome section**
  - Title: “Welcome back” (+ “, Premium Member” if premium).
  - Sub: Model — “Ready to discover new opportunities and grow your modeling career?”; Professional — “Ready to find the perfect models for your next project?”
  - Status pill: e.g. “Model: Approved” / “Professional: Pending” (with colour by status).

- **Premium promo banner** (only if not premium)
  - “Go Premium and get discovered!” “Boost visibility, unlimited applications & priority access”
  - Button: “Upgrade your account” → `/dashboard/premium`.

- **Quick actions** (from `dashboardStore`, role-based)
  - **Model:** Browse Castings (Find new opportunities) → `/casting`; Update Portfolio → `/dashboard/update-portfolio`; Bookings → `/dashboard/bookings`.
  - **Professional:** Post a Casting (Find the perfect model) → `/dashboard/post-casting`; My Castings (Manage your posts) → `/dashboard/my-castings`; Marketplace (Offer services) → `/dashboard/mymarketplace`.

- **Sections**
  - “Most recent castings” — grid of casting cards (placeholder or from API) — “See more castings” → `/casting`.
  - “Latest message” — empty state: “You don't have any messages” + premium CTA if not premium.
  - “Latest booking” — empty state: “You haven't had any bookings” + short CTA.

- **Account under review CTA** (if status !== 'approved')
  - “Account Under Review” — “Your model/professional account is currently being reviewed…”
  - Link: “View Status” → `/verification-pending` or “Complete Registration” → become-model/register.

**Data:** `dashboardStore`: `fetchDashboardData(userId, role)` loads model/profile, stats, followStats, quickActions; `setupRealTimeListeners` for user doc, portfolio photos (model), castings (professional).

### 4.2 Sidebar nav (model vs professional)

**Model:**  
Premium → Dashboard → Account → Favorites → Casting Applications → Bookings → Reviews → Payouts → My Marketplace → Subscription.

**Professional:**  
Premium → Dashboard → Account → Favorites → My Castings → Post a Casting → Bookings → Reviews → Marketplace → Subscription.

### 4.3 Dashboard pages (sections/features)

- **Account** (`/dashboard/account`) — Tabs: Personal, Public, Notifications. Sub-routes: `/dashboard/account/personal`, `/dashboard/account/public`, `/dashboard/account/notifications`. Edit and save per section; real-time sync where implemented.

- **Favorites** (`/dashboard/favorites`) — List of saved models/favourites; remove/add; data from likes/favourites collection.

- **Casting applications** (`/dashboard/castingapp`) — Model: list of applications (casting title, status, date); filters/search if any; view/withdraw.

- **My castings** (`/dashboard/my-castings`) — Professional: list of own castings; create/edit/close; view applications count; link to post-casting.

- **Post a casting** (`/dashboard/post-casting`) — Full form (see 3.5); professionals only.

- **Bookings** (`/dashboard/bookings`) — List of bookings (model or professional); status, date, party; from `bookings` or `enhanced-bookings`.

- **Reviews** (`/dashboard/reviews`) — Reviews received (or given); from `reviews` collection.

- **Payouts** (`/dashboard/payouts`) — Model: payout history/requests.

- **My marketplace** (`/dashboard/mymarketplace`) — Professional: list of own offers; “Post New Offer” (modal); premium required; empty state “No offers yet” + “Post Your First Offer”; edit/delete offers.

- **Subscription** (`/dashboard/subscription`) — Current plan, renew, cancel.

- **Premium** (`/dashboard/premium`) — Upgrade CTA; plans; payment flow.

- **Upgrade** (`/dashboard/upgrade`) — Contextual upgrade (e.g. after hitting limit).

- **Update portfolio** (`/dashboard/update-portfolio`) — Model: upload/remove portfolio photos.

- **Boards** (`/dashboard/boards`) — Boards feature (if used).

- **Notifications** (`/dashboard/notifications`) — In-app notifications list.

- **Followers** (`/dashboard/followers`) — Followers/following counts and list (if used).

**Minute details:** Loading states (“Loading Dashboard…”, “Loading your offers…”), error states (Retry), empty states (no offers, no messages, no bookings), premium gates (marketplace post, some messaging), and “Back to Admin” / “Back to dashboard” where applicable.

---

## Part 5: Admin panel — all sections and features

**Access:** Only admin users; main login redirects admins to `/admin/login`. Session: POST `/api/auth/session`, POST `/api/auth/check-status`.

**Layout:** No public header/footer. Sidebar + main content; mobile: hamburger + “Admin Panel” title.

### 5.1 Sidebar

- **Tabs (in-page):** Dashboard, User Management, Model Approvals, Professional Approvals, Casting Management, Availability Requests, Marketplace Offers, Direct Bookings, Portfolio Updates, Review Moderation, Send Messages, Message History, Email Jobs.
- **Links (separate pages):** Premium Users → `/admin/premium-users`, Payment Verifications → `/admin/bank-transfers`.
- **Footer:** View Site (open `/` in new tab), Sign Out.

### 5.2 Main panel tabs — sections and features

- **Dashboard**
  - Stats: Total Users, Pending Approvals, Total Models, Total Professionals, Availability Requests, Pending Availability Checks, Marketplace Offers, Pending Marketplace Approvals.
  - Quick actions: Approve Users, Manage Castings, Availability Requests, Marketplace Offers (with “X pending” if any).

- **User Management**
  - Filters: Search, Status (All/Pending/Changes Requested/Updated/Approved/Rejected), Role (All/Models/Professionals), Profile (All/Complete/Incomplete).
  - Table: User, Email, Role, Status, Joined, Actions (View, Edit, Approve/Reject/Request changes).
  - Loading: “Loading users…”.

- **Model Approvals**
  - Same filter idea; table: Model, Email, Status, Registration Date, Profile Completion, Actions.
  - Loading: “Loading models…”.

- **Professional Approvals**
  - Table: Professional, Email, Company, Status, Registration Date, Actions.
  - Loading: “Loading professionals…”.

- **Casting Management**
  - Stats: Total Castings, Active, Pending Approval, Rejected.
  - Filter: Status.
  - Table: Casting, Creator, Type, Status, Applications, Created, Actions.
  - Loading: “Loading castings…”.

- **Availability Requests**
  - List/table of connection (availability) requests; filters; view/approve/reject in modal.

- **Marketplace Offers** (in-panel)
  - List of offers; status; approve/reject. (Full-page version at `/admin/marketplace`.)

- **Direct Bookings**
  - List of direct booking requests; filters; actions.

- **Portfolio Updates**
  - List of portfolio update requests; view in modal.

- **Review Moderation**
  - List of reviews; search/filters; moderate.

- **Send Messages**
  - Filters: Role, Status, Profile; search; select users; Subject + Message; send (bulk/single). Uses SendMessageModal for single user.

- **Message History**
  - List of sent messages; search; stats (total, sent, failed).

- **Email Jobs**
  - List of email jobs (queue/logs).

**Modals:** AdminViewModal (view user/model/professional/casting/availability), SendMessageModal, Edit user (tabs: Personal, Measurements, Professional, Social, Details), Availability modal, Portfolio update modal. Confirmations: approve/reject/request changes/delete; prompt for rejection reason where required.

### 5.3 Admin sub-pages

- **Marketplace administration** (`/admin/marketplace`)  
  - “Marketplace Administration” — “Review and approve marketplace offers from professionals.”  
  - Pending count; list of pending offers (image, title, phone, email, description, social links, all photos); Approve / Reject per offer.  
  - Empty: “All caught up!” “No pending offers to review.”

- **Premium users** (`/admin/premium-users`)  
  - “Premium Users Management” — “Monitor subscriptions, transactions, and user premium status.”  
  - Back to Admin, Refresh, Export CSV.  
  - Stats: Total Premium Users, Active Subscriptions, Expiring Soon (7 days), Expired, Total Revenue, Last 30 Days Revenue.  
  - Filters: Search, Status (All/Active/Expired/Expiring Soon), Plan (All/Monthly/Quarterly/6 Months).  
  - Table/cards: user, plan, status, dates, total spent, transactions, auto renew; expand for history.

- **Payment verifications** (`/admin/bank-transfers`)  
  - “Payment Verifications” — “Review and approve bank transfer & Juice payments.”  
  - Tabs: All Submissions, Pending, Approved, Rejected.  
  - Cards: status, user, plan, amount, payment type (Bank Transfer / Juice Payment), Subtotal, VAT, Period, User notes, Proof (download), “Review & Process” (if pending).  
  - Review modal: Payment Information (User, Email, Plan, Amount, Payment Method), Payment Proof (preview + download), Admin notes (required for reject) → “Reject Payment” / “Approve & Grant Premium”.

- **Details** (`/admin/details/[type]/[id]`)  
  - **Types:** model, professional, casting.  
  - **Header:** Back to Admin, title (name or casting title), “{Type} Details - ID: …”.  
  - **Actions:** Approve, Reject (with reason for casting), Suspend, Activate, Delete (with confirmations).  
  - **Tabs:**  
    - **Model:** Overview (basic + personal), Personal, Professional, Photos, Social.  
    - **Professional:** Overview, Company, Photos, Social.  
    - **Casting:** Overview (casting details, creator), Requirements, Compensation, Schedule, Applications.  
  - Loading: “Loading {type} details…”; Error / No data found with “Go Back”.

---

## Part 6: Form workflows (summary)

1. **Signup** → Create user + `users` (role `user`) → [OTP if used] → **Redirect: select-role**.
2. **Select role** → Update `users` role → **Redirect: become-model or register**.
3. **Become-model** → Step 1 save to `models` (draft) → Step 2 submit → set `hasCompletedRegistration`, `status: 'pending'` → **Redirect: verification-pending**.
4. **Register** → Submit → complete registration → **Redirect: verification-pending or dashboard**.
5. **Verification-pending** → (no form) → Admin approves → **Redirect: dashboard**; reject → **Redirect: rejected**; request changes → **Redirect: revise-application**.
6. **Revise** → (no form) → User goes to become-model/register → resubmit → **Redirect: verification-pending**.
7. **Login** → Sign in → load profile → **Redirect:** select-role | become-model | register | verification-pending | revise | rejected | **dashboard** (if approved).
8. **Post casting** → Submit → `castings` (pending) → success; admin approves later.
9. **Marketplace offer** → Submit → `marketplace` (pending) → success; admin approves later.
10. **Account forms** → Save → update Firestore; real-time listeners update UI where used.
11. **Admin login** → Session + check-status → **Redirect: /admin**.

---

## Part 7: Data and files (quick reference)

- **Auth/redirect:** `contexts/AuthContext.tsx` — `determineUserRedirectPath`, public routes, protected routes.
- **Forms:** `app/signup`, `app/login`, `app/forgot-password`, `app/select-role`, `app/become-model`, `app/register`, `app/contact`, `app/dashboard/post-casting`, `app/dashboard/mymarketplace` (PostOfferModal), `app/dashboard/account/*`, `app/report`, `app/admin/login`.
- **Dashboard:** `app/dashboard/layout.tsx`, `app/dashboard/page.tsx`, `app/components/Sidebar/Sidebar.tsx`, `lib/stores/dashboardStore.ts`.
- **Admin:** `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/marketplace`, `app/admin/premium-users`, `app/admin/bank-transfers`, `app/admin/details/[type]/[id]`.
- **Firestore:** `users`, `models`, `castings`, `casting-applications`, `marketplace`, `likes`, `reviews`, `bookings`, `notifications`, etc. (see WEBSITE_WORKING_PLAN.md).

Use this brief with **WEBSITE_WORKING_PLAN.md**, **MIGRATION_PAGE_CONTENTS.md**, and **ADMIN_PANEL_WORKING_AND_BODY.md** to replicate forms, dashboard, and admin on another website.
