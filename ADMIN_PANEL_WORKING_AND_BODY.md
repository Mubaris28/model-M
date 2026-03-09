# Admin Panel — Working, Structure & Body Content

This document describes how the admin panel works, its layout, routes, and all user-facing body content (headings, labels, buttons, tables, forms) for migration or reference.

---

## 1. Access & authentication

### 1.1 Who can access

- Only users with **admin privileges** (e.g. `users/{uid}.isAdmin === true` or admin list in `lib/admin`).
- Main site login: if email is detected as admin via `/api/admin/check-email`, user is redirected to **`/admin/login`** (no session created on main login for admin flow).

### 1.2 Admin login flow

1. **Route:** `/admin/login`
2. User enters **Email** and **Password**.
3. Firebase `signInWithEmailAndPassword` runs.
4. **Session:** `POST /api/auth/session` with `{ idToken, isAdmin: true }` to create session cookie.
5. **Verify:** `POST /api/auth/check-status` to confirm `isAdmin`; then redirect to **`/admin`**.
6. If user is logged in but **not** admin → sign out and show: `Admin access only. Regular users must use the main login page.`
7. Errors: `Invalid email or password`, `Too many failed login attempts...`, `Access denied. You do not have admin privileges.`, `Failed to create session...`

### 1.3 Layout guard

- **File:** `app/admin/layout.tsx`
- **Logic:**
  - On `/admin/login`: render only `children` (no admin shell).
  - Otherwise: require `user` and `isAdmin`; if not, redirect to `/admin/login`.
  - While `loading` or `!adminChecked`: show loading screen.
- **Loading screen copy:**  
  - Heading: `Loading Admin Panel...`  
  - Sub: `Please wait while we verify your credentials`

---

## 2. Admin layout (main panel)

- **Route:** `/admin` (single-page panel with sidebar and tabbed main content).
- **Wrapper:** `<div className={styles.adminLayout}>` (from layout) then `<div className={styles.adminContainer}>` (from page).
- **No** public site header/footer; admin has its own nav and content.

### 2.1 Mobile navbar (top)

- **Menu toggle** (hamburger) — aria-label: `Toggle menu`
- **Title:** `Admin Panel`

### 2.2 Sidebar (collapsible)

- **Toggle button:** `←` / `→` — title: `Collapse Sidebar` / `Expand Sidebar`
- **Nav items (in-page tabs):**
  - Dashboard
  - User Management
  - Model Approvals
  - Professional Approvals
  - Casting Management
  - Availability Requests
  - Marketplace Offers
  - Direct Bookings
  - Portfolio Updates
  - Review Moderation
  - Send Messages
  - Message History
  - Email Jobs
- **Links to separate pages:**
  - **Premium Users** → `/admin/premium-users`
  - **Payment Verifications** → `/admin/bank-transfers`
- **Footer buttons:**
  - **View Site** — opens `/` in new tab
  - **Sign Out**

### 2.3 Main content header

- **Welcome:**  
  - Heading: `Admin Panel`  
  - Text: `Welcome, {user?.email || 'admin@modelmanagement.mu'}`
- **Section title (per tab):**
  - Dashboard → `Dashboard Overview`
  - Users → `User Management`
  - Models → `Model Approvals`
  - Professionals → `Professional Approvals`
  - Castings → `Casting Management`
  - Connections → `Model Availability Requests`
  - Marketplace → `Marketplace Offers`
  - Direct Bookings → `Direct Booking Requests`
  - Portfolio Updates → `Portfolio Updates`
  - Reviews → `Review Moderation`
  - Messaging → `Send Messages`
  - Message History → `Message History`
  - Email Jobs → `Email Jobs`
- **Header action:** Button `Refresh Data` (re-fetches users and stats).

### 2.4 Access denied (non-admin)

- Shown if `!isAdmin` when rendering main panel:
  - Icon: exclamation triangle
  - Heading: `Access Denied`
  - Text: `You do not have permission to access the admin panel.`

### 2.5 Auth verification overlay

- While `authLoading`: full-screen overlay with text `Verifying admin access...`

### 2.6 Auth error banner

- If `authError`: red banner titled **Authentication Error:** and message (e.g. `Session expired. Please log in again.`, `Access denied. Admin privileges required.`).

---

## 3. Admin login page body (`/admin/login`)

- **Container:** `adminLoginContainer` / `adminLoginCard`
- **Heading:** `Admin Portal`
- **Sub:** `Please login with your administrator credentials`
- **Form:**
  - Label: `Email` — input type email, required
  - Label: `Password` — input type password, required
  - Submit: `Login to Admin Panel` (loading: `Logging in...`)
- **Error:** Shown in `errorMessage` (e.g. invalid credentials, admin only, session failed).
- **Redirect state:** When already admin and redirecting: GlobalLoading with message `Admin Access Granted`, subMessage `Please wait while we prepare your admin panel...`

---

## 4. Main admin panel body — tabs content

### 4.1 Dashboard tab

- **Stats grid (8 cards):**
  - **Total Users** — value: `stats.totalUsers`
  - **Pending Approvals** — value: `stats.pendingApprovals`
  - **Total Models** — value: `stats.totalModels`
  - **Total Professionals** — value: `stats.totalProfessionals`
  - **Availability Requests** — value: `stats.totalConnectionRequests`
  - **Pending Availability Checks** — value: `stats.pendingConnectionRequests` (highlight if > 0)
  - **Marketplace Offers** — value: `stats.totalMarketplaceOffers`
  - **Pending Marketplace Approvals** — value: `stats.pendingMarketplaceOffers` (highlight if > 0)

- **Quick Actions (heading:** `Quick Actions`**):**
  - **Approve Users** → switch to User Management tab
  - **Manage Castings** → switch to Casting Management tab
  - **Availability Requests** → switch to Availability Requests tab (shows “X pending” if any)
  - **Marketplace Offers** → switch to Marketplace Offers tab (shows “X pending” if any)

### 4.2 User Management tab

- **Filters:**
  - Search: placeholder `Search users...`
  - **Status:** All Status | Pending | Changes Requested | Updated (Resubmitted) | Approved | Rejected
  - **Role:** All Roles | Models | Professionals
  - **Profile:** All Profiles | Complete | Incomplete

- **Table:**
  - **Columns:** User | Email | Role | Status | Joined | Actions
  - User cell: full name + `ID: {id}`
  - Role badge: model (camera icon) / professional (building icon)
  - Status badge: approved / rejected / pending / etc.
  - Joined: locale date
  - Actions: View (eye), Edit, Approve/Reject/Request changes (depending on status)

- **Loading:** Spinner + text `Loading users...`

### 4.3 Model Approvals tab

- **Filters:** Same idea as User Management: search, **Status** (All / Pending / Changes Requested / Updated / Approved / Rejected), **Profile** (All / Complete / Incomplete).

- **Table:**
  - **Columns:** Model | Email | Status | Registration Date | Profile Completion | Actions
  - Model cell: name + `ID: {id}`
  - Actions: View, Approve, Reject, Request changes, etc.

- **Loading:** `Loading models...`

### 4.4 Professional Approvals tab

- **Filters:** Search, Status, Profile (same options as models).

- **Table:**
  - **Columns:** Professional | Email | Company | Status | Registration Date | Actions
  - Loading: `Loading professionals...`

### 4.5 Casting Management tab

- **Stats row (4 cards):**
  - **Total Castings** — count
  - **Active Castings** — count
  - **Pending Approval** — count
  - **Rejected** — count

- **Filters:**
  - **Status:** All Status | Pending | Approved | Rejected

- **Table:**
  - **Columns:** Casting | Creator | Type | Status | Applications | Created | Actions
  - Loading: `Loading castings...`

### 4.6 Availability Requests tab

- Table/list of connection (availability) requests; filters by status. Copy structure from `app/admin/page.tsx` (connectionStatusFilter, filteredConnectionRequests).

### 4.7 Marketplace Offers tab (in-panel)

- Lists marketplace offers with status; approve/reject. For **dedicated** marketplace admin page body, see section 6.

### 4.8 Direct Bookings tab

- Table of direct booking requests; filters and actions.

### 4.9 Portfolio Updates tab

- List of portfolio update requests; view/review.

### 4.10 Review Moderation tab

- Search, filters; table of reviews to moderate.

### 4.11 Send Messages tab

- Filters: Role (All / Model / Professional / Admin), Status (All / Approved / Pending / Rejected), Profile (All / Complete / Incomplete), search.
- UI to select users, set **Subject** and **Message**, send bulk or single message.

### 4.12 Message History tab

- List of sent messages; search; stats (total, sent, failed).

### 4.13 Email Jobs tab

- List of email jobs (queue / logs).

---

## 5. Modals used in main panel

- **AdminViewModal:** View full user/model/professional/casting/availability request. Opened from “View” actions; content depends on type (personal info, photos, company, etc.).
- **SendMessageModal:** Send message to a single user (subject, content).
- **Edit user modal:** Tabs Personal, Measurements, Professional, Social, Details; form fields mirror user profile; Save/Cancel.
- **Availability request modal:** Shows professional details, model, request info; approve/reject.
- **Portfolio update modal:** View submitted portfolio updates.

Confirmations and prompts use **CustomPopup** (`showConfirm`, `showSuccess`, `showError`) and **CustomInputPopup** (`showPrompt`) — e.g. “Are you sure you want to approve this user?”, “Reason for rejection:”.

---

## 6. Marketplace Administration (`/admin/marketplace`)

- **Route:** `/admin/marketplace` (standalone page; linked from sidebar as “Marketplace Offers” or via main panel Marketplace tab for full-page experience; current app has **separate** page at this route).

### 6.1 Page body

- **Header:**
  - H1: `Marketplace Administration`
  - Sub: `Review and approve marketplace offers from professionals`
  - **Stats:** One stat — `{count}` **Pending Offers**

- **Error banner:** Icon + message + button `Retry`

- **Loading:** Spinner + `Loading pending offers...`

- **Empty state:**
  - Icon (clipboard-check)
  - H3: `All caught up!`
  - Text: `No pending offers to review at the moment.`

- **Offer cards (for each pending offer):**
  - Image (or “No Image” placeholder); badge **Pending Review**; photo count if multiple.
  - **Title:** `offer.title`
  - **Details:** Phone, Email (with icons)
  - **Description** (if present): H4 `Description`, then text
  - **Social Media & Contact Links:** H4 + links (Website, Instagram, Facebook, TikTok, LinkedIn, Twitter)
  - **All Photos (n):** H4 + gallery of images
  - **Actions:**  
    - `Approve` (loading: `Processing...`)  
    - `Reject` (loading: `Processing...`)

---

## 7. Premium Users (`/admin/premium-users`)

- **Route:** `/admin/premium-users`
- **Guard:** Uses auth; typically `requireAdmin` or same as main panel.

### 7.1 Page body

- **Back:** Button `Back to Admin` → `/admin`
- **Heading:** `Premium Users Management`
- **Sub:** `Monitor subscriptions, transactions, and user premium status`
- **Header actions:** `Refresh`, `Export CSV`

- **Error block (if any):** Title `Error Loading Premium Users`, message, button `Retry`

- **Stats grid (6 cards):**
  - **Total Premium Users**
  - **Active Subscriptions**
  - **Expiring Soon (7 days)**
  - **Expired**
  - **Total Revenue** (formatted currency)
  - **Last 30 Days Revenue**

- **Filters:**
  - Search: placeholder `Search by email, name, or user ID...`
  - **Status:** All | Active | Expired | Expiring Soon
  - **Plan:** All | Monthly | Quarterly | 6 Months

- **Table (or cards):** User, email, plan (Monthly/Quarterly/6 Months), status (Active / Expired / Expiring Soon / etc.), dates, total spent, transaction count, auto renew; expand for transaction history.

- **Loading:** Spinner + `Loading premium users...`

- **Export CSV columns:** User ID, Email, First Name, Last Name, Role, Plan, Status, Start Date, End Date, Days Remaining, Total Spent, Transaction Count, Auto Renew

---

## 8. Payment Verifications / Bank Transfers (`/admin/bank-transfers`)

- **Route:** `/admin/bank-transfers`
- **Guard:** `ProtectedRoute requireAdmin={true}`

### 8.1 Page body

- **Back:** Button `Back to Admin` → `/admin`
- **H1:** `Payment Verifications`
- **Sub:** `Review and approve bank transfer & Juice payments`

- **Filter tabs:**
  - `All Submissions`
  - `Pending` (icon: clock)
  - `Approved` (icon: check)
  - `Rejected` (icon: times)

- **Loading:** Spinner + `Loading submissions...`

- **Empty state:**
  - Icon (clock)
  - H3: `No submissions found`
  - Text: `There are no {filter} bank transfer submissions at the moment.`

- **Submission cards (each):**
  - Status badge: **Pending** | **Approved** | **Rejected**
  - Submitted date
  - **User:** avatar, name, email
  - **Plan:** crown icon + plan name
  - **Amount:** currency + amount
  - **Payment type badge:** `Bank Transfer` or `Juice Payment`
  - **Details:** Subtotal, VAT (15%), Period
  - **User Notes:** (if any)
  - **Proof:** file name + button `Download`
  - If pending: button `Review & Process`
  - **Admin Notes:** (if set) + “Verified by: … on …”

- **Review modal (when “Review & Process”):**
  - **Title:** `Review Payment`
  - **Section Payment Information:** labels User, Email, Plan, Amount, Payment Method (Bank Transfer / Juice Payment)
  - **Section Payment Proof:** preview (image or PDF) + button `Download Full Resolution`
  - **Section Admin Notes:** textarea placeholder `Add notes about this verification (optional for approval, required for rejection)`
  - **Actions:**  
    - `Reject Payment`  
    - `Approve & Grant Premium`
  - Confirmations: e.g. “Are you sure you want to approve this payment and grant premium status to {name}?” / “Are you sure you want to reject this payment from {name}?”
  - Reject validation: “Please add a note explaining the rejection reason”

---

## 9. Admin Details page (`/admin/details/[type]/[id]`)

- **Route:** `/admin/details/model|professional|casting/{id}`
- **Purpose:** View and act on a single user (model/professional) or casting.
- **Data:** GET `/api/admin/users?id=...` (model/professional) or GET `/api/admin/castings?id=...` (casting).

### 9.1 Layout

- **Back:** Button `Back to Admin` → `router.back()` or `/admin`
- **Title:** For casting: casting title; for user: name or “Unknown”
- **Sub:** `{Type} Details - ID: {id}` (e.g. Model Details - ID: abc123)
- **Header actions (depending on status):**
  - If **pending:** `Approve`, `Reject`
  - If **approved:** `Suspend`
  - If **suspended:** `Activate`
  - Always: `Delete`
- Confirmations: “Are you sure you want to {approve|reject|suspend|activate|delete} this {type}?” — title “Confirm Approve” etc. Reject for casting can prompt: “Reason for rejection:”.

### 9.2 Tabs and content

**Model (`type === 'model'`):**
- **Overview** — Basic Information (id, email, name, role, status, createdAt, location); Personal Information; optional sections from API.
- **Personal** — Personal Details, Physical Attributes.
- **Professional** — Professional Details, Experience.
- **Photos** — Profile Photo, Portfolio, Headshots, Work Photos (galleries with view/download).
- **Social** — Social Media & Statistics.

**Professional (`type === 'professional'`):**
- **Overview** — Basic Information; Professional Information.
- **Company** — Company Information.
- **Photos** — Profile/company/work photos.
- **Social** — Social Media & Statistics.

**Casting (`type === 'casting'`):**
- **Overview** — Basic info; Casting Details (title, description, castingType, approvalStatus); Created By.
- **Requirements** — Casting Requirements.
- **Compensation** — Compensation Details.
- **Schedule** — Schedule Information.
- **Applications** — Application Count; list of applicants (Applicant, Status, Applied date) or “No applications yet.”

### 9.3 Loading and errors

- **Loading:** Spinner + `Loading {type} details...`
- **Error:** Icon + H2 `Error Loading Data` + message + button `Go Back`
- **Not found:** H2 `No Data Found` + `The requested {type} could not be found.` + `Go Back`

### 9.4 Info display

- Sections use **Basic Information**, **Personal Information**, **Casting Details**, etc. with key-value grids (label: value). Keys are formatted from camelCase (e.g. “firstName” → “First Name”). Arrays shown as comma-separated; objects as JSON.

---

## 10. Data and APIs (reference)

| Purpose | Source |
|--------|--------|
| Admin check | `lib/admin` `checkAdminStatus`, `users/{uid}.isAdmin` or admin list |
| Session | POST `/api/auth/session`, POST `/api/auth/check-status` |
| Users list & stats | Firestore `users`; admin API for list/stats |
| Models / professionals | Same `users` filtered by role; model-specific docs if used |
| Castings | Firestore `castings`; GET/PUT `/api/admin/castings` |
| Connection/availability requests | Firestore e.g. `connection-requests` or availability collection |
| Marketplace offers | `lib/marketplace` `getPendingOffers`, `approveOffer`, `rejectOffer`; Firestore `marketplace` |
| Premium users | GET `/api/admin/premium-users` |
| Bank transfers | GET `/api/admin/bank-transfers?filter=...`, POST approve/reject |
| User action | POST `/api/admin/user-action` (userId, action) |
| Single user/casting | GET `/api/admin/users?id=...`, GET `/api/admin/castings?id=...` |

---

## 11. File reference

| File | Purpose |
|------|--------|
| `app/admin/layout.tsx` | Admin guard, loading screen, layout wrapper |
| `app/admin/login/page.tsx` | Admin login form and session flow |
| `app/admin/page.tsx` | Main panel: sidebar, tabs, dashboard, users/models/professionals/castings/connections/marketplace/direct-bookings/portfolio/reviews/messaging/message-history/email-logs |
| `app/admin/marketplace/page.tsx` | Standalone marketplace admin (pending offers, approve/reject) |
| `app/admin/premium-users/page.tsx` | Premium users list, stats, filters, export CSV |
| `app/admin/bank-transfers/page.tsx` | Payment verifications list, review modal, approve/reject |
| `app/admin/details/[type]/[id]/page.tsx` | Detail view and actions for model/professional/casting |
| `app/admin/admin.module.css` | Main panel styles |
| `app/admin/admin-login.module.css` | Login page styles |
| `app/components/AdminViewModal.tsx` | View modal for users/castings/availability |
| `app/components/SendMessageModal.tsx` | Send message to user |

Use this document together with **WEBSITE_WORKING_PLAN.md** and **MIGRATION_PAGE_CONTENTS.md** for full site and body reference.
