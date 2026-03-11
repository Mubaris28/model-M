/**
 * Validate required and optional env vars on startup. Fail fast with clear messages.
 */
function validateEnv() {
  if (!process.env.MONGODB_URI?.trim()) {
    console.error("Missing MONGODB_URI. Copy server/.env.example to server/.env and set it.");
    process.exit(1);
  }
  if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET?.trim()) {
      console.error("Missing JWT_SECRET in production.");
      process.exit(1);
    }
    if (process.env.JWT_SECRET.length < 32) {
      console.error("JWT_SECRET should be at least 32 characters in production.");
      process.exit(1);
    }
  }
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN || true,
    NODE_ENV: process.env.NODE_ENV || "development",
  };
}

export default validateEnv;
