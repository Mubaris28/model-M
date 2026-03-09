# Full Working Flow — From Login to Dashboard

This document describes how the website works **from login**: the user must **complete all forms first**, then **wait for admin approval**; only after approval do they get access to the **dashboard**.

---

## Important: Signup vs Login

- **Create account (signup):** After signing up, the user is **always** sent to **`/select-role`** to complete the flow. They are **never** sent to the admin panel, even if their email is an admin email. Admin panel access is only for **login**.
- **Login:** Returning users are redirected by their state (select-role, forms, verification-pending, or **dashboard** if approved). Admins are sent to **`/admin`** when they **log in**.

---

## Rule

- **After login**, the user is **never** sent to the dashboard until:
  1. They have **completed all registration forms** (select role + model or professional application).
  2. An **admin has approved** their account (`status = approved`).

---

## Step-by-step flow

### 1. Login (`/login`)

- User enters **email** and **password** and submits.
- Backend validates and returns **user** + **token**.
- The app decides the **next page** from the user’s current state (see table below).  
- **Important:** If the user has not completed all forms or is not approved, they are **not** sent to the dashboard.

---

### 2. Where the user goes after login

| # | Condition | Redirect to | Meaning |
|---|-----------|-------------|--------|
| 1 | User is **admin** | `/admin` | Admin panel |
| 2 | **Role** is still `"user"` (hasn’t chosen Model/Professional) | `/select-role` | Must choose account type |
| 3 | **Role = model** and **profile not complete** | `/become-model` | Must complete model application |
| 4 | **Role = professional** and **profile not complete** | `/register` | Must complete professional registration |
| 5 | **Profile complete** and **status** is `pending` or `updated` | `/verification-pending` | Forms done; waiting for admin approval |
| 6 | **Status** = `changes_requested` | `/revise-application` | Admin asked for changes; must edit and resubmit |
| 7 | **Status** = `rejected` | `/rejected` | Application rejected |
| 8 | **Profile complete** and **status** = `approved` | `/dashboard` | **Only now** does the user get dashboard access |

So: **dashboard is only used when the user has completed all forms and has been approved.**

---

### 3. Complete all forms (required before approval)

#### Step A — Select role (`/select-role`)

- User chooses **“I’m a Model”** or **“I’m a Professional”**.
- Confirmation step → **Confirm & Continue**.
- Backend updates **role** to `model` or `professional`.
- Redirect:
  - **Model** → `/become-model`
  - **Professional** → `/register`

#### Step B — Model application (`/become-model`) **or** Professional registration (`/register`)

**Model:**

- **Step 1:** Personal info, measurements, categories, social, portfolio (progress saved in browser).
- **Step 2:** ID/passport number, ID photo, selfie with ID.
- User clicks **Submit Application** → backend sets `profileComplete = true`, `status = "pending"` → redirect to **`/verification-pending`**.

**Professional:**

- One form: company, type, services, location, contact, about, etc. (progress saved in browser).
- User clicks **Complete Registration** → backend sets `profileComplete = true`, `status = "pending"` → redirect to **`/verification-pending`**.

Until this is done, the user **cannot** reach the verification-pending screen (guards block it). So **all forms must be completed first**.

---

### 4. After all forms are complete — admin approval

- User lands on **`/verification-pending`** with message “Account under review”.
- They can **Sign out** or **Contact us**. They **cannot** access the dashboard yet.
- **Admin** (in admin panel) approves, rejects, or requests changes.

---

### 5. After admin decision

| Admin action | User status | Where user goes (on next login or refresh) |
|--------------|-------------|--------------------------------------------|
| **Approve** | `approved` | **`/dashboard`** — full access |
| **Reject** | `rejected` | `/rejected` — message + Sign out |
| **Request changes** | `changes_requested` | `/revise-application` — link back to `/become-model` or `/register` to edit and resubmit |

---

### 6. Dashboard access (only when approved)

- **Dashboard** and all **`/dashboard/*`** routes are **protected**.
- Allowed only when:
  - User is logged in, **and**
  - **profileComplete === true**, **and**
  - **status === "approved"**.
- If the user is not approved (e.g. still pending, rejected, or changes requested), they are **redirected** to the correct step (verification-pending, rejected, revise-application, or the form they must complete).

So: **login → complete all forms → wait for admin approval → only then dashboard.** This is the full working flow.

---

## Features added

- **Progress stepper:** Steps 1–5 (Account → Choose role → Application → Review → Dashboard) shown on select-role, become-model, register, and verification-pending.
- **Admin rejection reason:** When admin clicks Reject or Request changes, they must enter a reason. The user sees it on the Rejected and Revise application pages.
- **Reapply:** On the Rejected page, user can click Reapply to set status back to pending and go to the application form to submit again.
- **Basic validation:** Model application requires Date of birth, Gender, and at least one category before continuing to Step 2.
- **Signup never goes to admin:** New signups always go to select-role, even if the email is in the admin list. Admin panel is only for existing users who **log in**.
