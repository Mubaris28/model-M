import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const inputArg = readArg("input");
  const dryRun = (readArg("dryRun") || "false").toLowerCase() === "true";

  if (!inputArg) {
    console.error("Missing required argument --input=<path-to-phase1-export-dir>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputArg);
  const modelsPath = path.join(inputDir, "models.json");
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const modelsJson = await readJson(modelsPath);
  if (!Array.isArray(modelsJson?.docs)) {
    throw new Error("Invalid models.json format. Expected { docs: [...] }.");
  }

  await mongoose.connect(mongoUri);
  const usersCollection = mongoose.connection.db.collection("users");

  let modelsWithUsername = 0;
  let updatedByUid = 0;
  let updatedByEmail = 0;
  let skippedNoUsername = 0;
  let skippedNoMatch = 0;
  let skippedSameValue = 0;

  for (const doc of modelsJson.docs) {
    const firebaseUid = doc?.id;
    const modelData = doc?.data || {};
    const username = normalizeUsername(modelData.username);
    const email = normalizeEmail(modelData.email);

    if (!username) {
      skippedNoUsername += 1;
      continue;
    }

    modelsWithUsername += 1;

    const existingByUid = firebaseUid
      ? await usersCollection.findOne(
          { firebaseUid },
          { projection: { _id: 1, username: 1 } }
        )
      : null;

    if (existingByUid?._id) {
      if (normalizeUsername(existingByUid.username) === username) {
        skippedSameValue += 1;
        continue;
      }

      if (!dryRun) {
        await usersCollection.updateOne(
          { _id: existingByUid._id },
          { $set: { username, updatedAt: new Date() } }
        );
      }
      updatedByUid += 1;
      continue;
    }

    if (email) {
      const existingByEmail = await usersCollection.findOne(
        { email },
        { projection: { _id: 1, username: 1 } }
      );

      if (existingByEmail?._id) {
        if (normalizeUsername(existingByEmail.username) === username) {
          skippedSameValue += 1;
          continue;
        }

        if (!dryRun) {
          await usersCollection.updateOne(
            { _id: existingByEmail._id },
            { $set: { username, updatedAt: new Date() } }
          );
        }
        updatedByEmail += 1;
        continue;
      }
    }

    skippedNoMatch += 1;
  }

  const report = {
    mode: "sync-model-usernames-from-export",
    dryRun,
    inputDir,
    scannedModelDocs: modelsJson.docs.length,
    modelsWithUsername,
    updatedByUid,
    updatedByEmail,
    skippedNoUsername,
    skippedNoMatch,
    skippedSameValue,
    completedAt: new Date().toISOString(),
  };

  const reportDir = path.resolve(__dirname, "..", "migrations", "phase1");
  await fs.mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `username-sync-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("Username sync complete.");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Username sync failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
