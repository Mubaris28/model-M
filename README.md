# Model Management Mauritius

Professional modeling platform for models and talent in Mauritius. Connect with brands, photographers, and agencies.

## Project setup

- **Node.js** and **npm** (or Bun) are required.

### Install and run locally

```sh
# Install all dependencies (frontend + Node.js backend)
npm run install:all

# Or install separately:
# npm install          # frontend only
# cd server && npm install   # backend only

# Start the development server (frontend)
npm run dev
```

### Build for production

```sh
npm run build
```

Output is in the `dist` folder. Deploy that folder to any static host (e.g. Vercel, Netlify).

### Backend API (Node.js + Express + MongoDB)

The backend lives in the **`server/`** folder. It runs on port 3001 and handles auth, contact form, and admin.

```sh
# Install backend dependencies (included in npm run install:all)
cd server && npm install && cd ..

# Create server/.env (copy from server/.env.example) and set:
# - MONGODB_URI (your MongoDB Atlas connection string)
# - JWT_SECRET (random string for JWT signing)
# - ADMIN_EMAILS (comma-separated admin emails)

# Run the API (in a separate terminal)
npm run server
```

With the API running, the frontend dev server (port 8080) proxies `/api` to the backend. For production, set `VITE_API_URL` to your deployed API URL.

### Other scripts

- `npm run preview` – preview production build locally
- `npm run lint` – run ESLint
- `npm run test` – run tests

## Tech stack

- **Vite** – build tool and dev server
- **React** – UI
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** – components
- **Backend:** Express, MongoDB (Mongoose), JWT auth

## Deploying

Build the project with `npm run build`, then deploy the `dist` directory to your hosting provider. For Vercel, connect your Git repo; the default build command and output directory are detected automatically.
