# MongoDB database structure

This document describes how data is organised in MongoDB so you can find and understand it easily (e.g. in MongoDB Compass or Atlas).

---

## Database

- **Name:** Comes from your `MONGODB_URI` (e.g. the part after the host: `mongodb.net/THIS_NAME?retryWrites=...`).
- **Single database** is used for the whole app.

---

## Collections (in order)

MongoDB has no folders; data lives in **collections**. Below is the list of collections and what they store.

| # | Collection  | Purpose | Main fields |
|---|-------------|--------|-------------|
| 1 | **users**   | All accounts: models, professionals, admins. | `email`, `password`, `fullName`, `role`, `status`, `profilePhoto`, `portfolio`, model fields (`height`, `categories`, etc.) |
| 2 | **castings**| Casting calls / jobs created by professionals. | `title`, `description`, `castingType`, `location`, `date`, `creatorId` → User, `approvalStatus` |
| 3 | **contacts**| Messages from the contact form. | `name`, `email`, `message`, `createdAt` |

---

## 1. users

- **Model file:** `server/models/User.js`
- **What it is:** User accounts (guests who sign up, models, professionals, admins).
- **Important fields:**
  - `email`, `password`, `fullName`, `phone`
  - `role`: `"user"` \| `"model"` \| `"professional"`
  - `status`: `"pending"` \| `"approved"` \| `"rejected"` \| `"changes_requested"` \| `"updated"`
  - `profilePhoto`, `portfolio[]`, `bio`, `country`, `city`
  - Model-specific: `height`, `dressSize`, `shoeSize`, `categories[]`, `dateOfBirth`, `idPhotoUrl`, `selfieWithIdUrl`
  - `isAdmin`, `profileComplete`
- **Timestamps:** `createdAt`, `updatedAt`

---

## 2. castings

- **Model file:** `server/models/Casting.js`
- **What it is:** Casting calls / jobs posted by professionals.
- **Important fields:**
  - `title`, `description`, `castingType`, `location`, `date`, `slots`, `brand`
  - `creatorId`: references **users** (ObjectId)
  - `approvalStatus`: `"pending"` \| `"approved"` \| `"rejected"`
- **Timestamps:** `createdAt`, `updatedAt`

---

## 3. contacts

- **Model file:** `server/models/Contact.js`
- **What it is:** Messages submitted via the website contact form (and optionally report/careers).
- **Important fields:**
  - `name`, `email`, `message`
- **Timestamps:** `createdAt`, `updatedAt`

---

## How to view in MongoDB

1. **MongoDB Compass** or **Atlas** → connect with your `MONGODB_URI`.
2. Open your **database** (name is in the URI).
3. You will see **collections**: `users`, `castings`, `contacts`.
4. Open a collection to browse documents; use filters to search.

Naming is flat (no folders): one database, three collections, so everything is easy to find.
