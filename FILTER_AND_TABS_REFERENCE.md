# Filter Tabs & Tabs Reference

Reference for all filter tabs, dropdown filters, and tabbed UIs used across the app. Use this for migration, replication, or UI consistency.

---

## 1. Models Page (Model Cards) — `/models`

**Source:** `app/models/models.tsx`

### Filter layout (3 rows)

**Row 1 — Discipline (horizontal buttons)**  
Filter key: `discipline`  
Default: `All`

| Option |
|--------|
| All |
| Fashion |
| Beauty |
| Commercial |
| Fitness |
| Lingerie |
| Runway |
| Hair Model |
| Parts Model |
| Alternative/Artistic |
| Catalog Model |

**Row 2 — Category (horizontal buttons)**  
Filter key: `category`  
Default: `All`

| Option |
|--------|
| All |
| Swimsuit Model |
| Plus Size Model |
| Glamour Model |
| Mature Model |
| Child Model |
| Content Creator |
| Petite |
| Tall |
| Tattoo-Body art |
| Curve |

**Row 3 — Dropdown filters (each with “Type to filter…” search)**  
Labels and keys:

| Label       | Key         | Default | Options (summary) |
|------------|-------------|--------|-------------------|
| Gender     | `gender`    | All   | All, Female, Male, Non-binary |
| Ethnicity  | `ethnicity` | All   | All + long list (African, Afro-Caribbean, Arab, Asian variants, Caucasian/White, Creole, East Asian, European, Hispanic/Latino, Mauritians, Mediterranean, Mixed Race, etc.) — see source for full list |
| Hair Color | `hairColor`| All   | All, Blonde, Brown, Black, Red, Auburn, Gray, White, Silver, Other |
| Eye Color  | `eyeColor` | All   | All, Blue, Brown, Green, Hazel, Gray, Amber, Other |
| Experience | `experience`| All  | All, Beginner (0-1 years), Intermediate (1-3 years), Experienced (3-5 years), Professional (5+ years) |
| Age        | `age`      | All   | All, 16-20, 21-25, 26-30, 31-35, 36-40, 40+ |
| Country    | `country`  | All   | All + full country list (Afghanistan … Zimbabwe) — see source for full list |

**Results text:** `{filteredModels.length} models available`

**Empty state:** “No models match your current filters. Try adjusting your search criteria.”

---

## 2. Model Castings Page — `/casting`

**Source:** `app/casting/casting.tsx`

### Filters (dropdowns, horizontal strip; mobile: scrollable)

| Label / Key   | Default          | Options |
|---------------|------------------|---------|
| Gender        | `gender`         | All     | All, Female, Male, Non-binary, Any |
| Casting Type  | `castingType`    | All     | All, Paid Shoot, Collaborative Shoot, Content Creation |
| Location      | `location`       | All locations | All locations, New York, Los Angeles, London, Paris, Berlin, Remote |
| Payment       | `isPaid`         | All     | All, Paid Only, Unpaid/TFP |

Filter state keys: `gender`, `castingType`, `location`, `isPaid`.

---

## 3. Home Page

### 3.1 New Faces (LatestWork) — Country filter tabs

**Source:** `app/components/LatestWork.tsx`  
**Section title:** “New Faces”

**Filter type:** Horizontal tab buttons (one per country).

**Default tabs:** `['All', 'Mauritian']` (initial state).  
**Runtime:** Tabs are built from unique model locations: `All`, `Mauritius`, then other countries from data (excluding France/French), sorted. Priority order: All, Mauritius first, then rest alphabetically.

So the **possible** tab values are: **All**, **Mauritius**, plus any other country string coming from `model.location` / `userCountry` / `nationality` (e.g. “Mauritian” in initial state, then “Mauritius” and others once data is loaded).

**Behavior:** Clicking a tab filters the “New Faces” model cards by that country/location.

---

### 3.2 New Faces (TrendingModels) — Discipline tabs

**Source:** `app/components/TrendingModels.tsx`  
**Section title:** “New Faces” (same section name, different component; home may use one or both depending on layout)

**Filter type:** Horizontal tabs (discipline/category).

| Tab label          | id |
|--------------------|----|
| All                | all |
| Fashion            | Fashion |
| Beauty             | Beauty |
| Commercial         | Commercial |
| Fitness            | Fitness |
| Lingerie           | Lingerie |
| Runway             | Runway |
| Hair Model         | Hair Model |
| Parts Model        | Parts Model |
| Alternative/Artistic | Alternative/Artistic |
| Catalog Model      | Catalog Model |

**Default:** `all`.  
Filtering is by model `professionalInfo.disciplines` matching the tab `id`.

---

### 3.3 Trending Castings — Casting type tabs

**Source:** `app/components/TrendingCastings.tsx`

**Filter type:** Horizontal tabs.

| Tab label      | id |
|----------------|----|
| All            | all |
| Paid           | paid |
| Collaborative  | collaborative |
| Content Creation | content-creation |
| Fashion        | fashion |
| Commercial     | commercial |
| Editorial      | editorial |

**Default:** `all`.  
Filtering is by casting type/category (e.g. `basicInfo.castingType` or equivalent).

---

## 4. Dashboard / Professional

### 4.1 My Castings — `/dashboard/my-castings`

**Source:** `app/dashboard/my-castings/page.tsx`

**Tabs (with counts):**

| Tab label | Key      | Icon (Font Awesome) | Empty state title |
|-----------|----------|--------------------|-------------------|
| Active    | active   | fa-play-circle     | No Active Castings |
| Filled    | filled   | fa-user-check      | No Filled Castings |
| Pending   | pending  | fa-clock           | No Pending Castings |
| Expired   | expired  | fa-calendar-times  | No Expired Castings |
| All       | all      | fa-list            | Start Your Casting Journey (or “No castings found for …” if search) |

**Empty state messages:**  
- Active: “Your approved and active castings will appear here. Post your first casting to get started!”  
- Filled: “Completed castings with booked models will be displayed here.”  
- Pending: “Castings awaiting admin approval will be shown here.”  
- Expired: “Past deadline castings will be listed here.”  
- All: “Create your first casting to connect with talented models and bring your creative vision to life.” (or search message)

---

### 4.2 Casting Applications — `/dashboard/castingapp`

**Source:** `app/dashboard/castingapp/page.tsx`

**Tabs:**

| Tab label           | Key    | Content |
|---------------------|--------|---------|
| Open Applications  | open   | Open applications list; count in tab |
| Closed Applications | closed | Closed applications list; count in tab |

---

### 4.3 Reviews — `/dashboard/reviews`

**Source:** `app/dashboard/reviews/page.tsx`

**Tabs:**

| Tab label   | Key     |
|-------------|---------|
| Given       | given   |
| Received    | received |

Empty copy: “No reviews given/received yet” depending on tab.

---

## 5. Admin

### 5.1 Bank Transfers (Payment Verifications) — `/admin/bank-transfers`

**Source:** `app/admin/bank-transfers/page.tsx`

**Filter tabs:**

| Tab label        | Filter value |
|------------------|--------------|
| All Submissions  | all          |
| Pending          | pending      |
| Approved         | approved     |
| Rejected         | rejected     |

Icons (Pending: FaClock, Approved: FaCheckCircle, Rejected: FaTimesCircle).

---

## 6. Marketplace

**Source:** `lib/stores/marketplaceStore.ts` (and any UI that uses it, e.g. marketplace pages)

**Filter state (keys):**

| Key           | Type              | Default / Notes |
|---------------|-------------------|------------------|
| category      | string            | `''`             |
| priceRange    | [number, number]  | `[0, 10000]`     |
| location      | string            | `''`             |
| serviceDate   | string            | `''`             |
| availability  | 'all' \| 'available' \| 'unavailable' | `'all'` |

**Behavior:**  
- Category and location: applied in query (e.g. Firestore `where`).  
- Price: client-side filter `price >= priceRange[0] && price <= priceRange[1]`.  
- Availability: client-side filter by item availability.

---

## Summary table

| Page / Component       | Route / Location     | Type           | Main options |
|------------------------|----------------------|----------------|--------------|
| Models (model cards)   | `/models`            | 3 rows: discipline buttons, category buttons, 7 dropdowns | Discipline, Category, Gender, Ethnicity, Hair, Eye, Experience, Age, Country |
| Model Castings        | `/casting`           | 4 dropdowns    | Gender, Casting Type, Location, Paid/Unpaid |
| Home – New Faces (LatestWork) | Home | Country tabs   | All, Mauritius, + dynamic countries |
| Home – New Faces (TrendingModels) | Home | Discipline tabs | All, Fashion, Beauty, Commercial, … (11) |
| Home – Trending Castings | Home               | Casting type tabs | All, Paid, Collaborative, Content Creation, Fashion, Commercial, Editorial |
| My Castings           | `/dashboard/my-castings` | 5 tabs      | Active, Filled, Pending, Expired, All |
| Casting Applications  | `/dashboard/castingapp`  | 2 tabs      | Open, Closed |
| Reviews               | `/dashboard/reviews`    | 2 tabs      | Given, Received |
| Admin Bank Transfers  | `/admin/bank-transfers` | 4 filter tabs | All, Pending, Approved, Rejected |
| Marketplace           | Store + marketplace UI  | Filters     | category, location, priceRange, availability |

---

*For full option lists (e.g. ethnicity, country), see `app/models/models.tsx` (filterOptions) and `app/casting/casting.tsx` (dropdownOptions).*
