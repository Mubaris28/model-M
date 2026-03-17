import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function normalizeUsername(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function main() {
  const inputArg = readArg("input");
  if (!inputArg) {
    console.error("Missing required argument --input=<path-to-phase1-export-dir>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputArg);
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const modelsPath = path.join(inputDir, "models.json");
  const modelsJson = JSON.parse(await fs.readFile(modelsPath, "utf8"));

  await mongoose.connect(mongoUri);
  const users = mongoose.connection.db.collection("users");

  const unmatched = [];

  for (const doc of modelsJson.docs || []) {
    const uid = doc?.id;
    const data = doc?.data || {};
    const username = normalizeUsername(data.username);
    if (!username) continue;

    const byUid = uid
      ? await users.findOne(
          { firebaseUid: uid },
          { projection: { _id: 1, firebaseUid: 1, email: 1, username: 1 } }
        )
      : null;
    if (byUid) continue;

    const email = normalizeEmail(data.email);
    const byEmail = email
      ? await users.findOne(
          { email },
          { projection: { _id: 1, firebaseUid: 1, email: 1, username: 1 } }
        )
      : null;
    if (byEmail) continue;

    unmatched.push({
      modelDocId: uid || "",
      firebaseUid: uid || "",
      email,
      username,
    });
  }

  console.log(JSON.stringify({ unmatchedCount: unmatched.length, unmatched }, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("find-unmatched-username-sync failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
