import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHASE_ONE_COLLECTIONS = ["users", "models", "castings", "contact-submissions"];

function toSerializable(value) {
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map(toSerializable);
  }

  if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      return value.toDate().toISOString();
    }

    if ("_seconds" in value && "_nanoseconds" in value) {
      return new Date(value._seconds * 1000).toISOString();
    }

    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toSerializable(v);
    }
    return out;
  }

  return value;
}

async function initFirebaseAdmin() {
  if (getApps().length) return;

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (serviceAccountPath) {
    const raw = await fs.readFile(serviceAccountPath, "utf8");
    const serviceAccount = JSON.parse(raw);
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }

  const serviceAccountInline = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountInline) {
    const serviceAccount = JSON.parse(serviceAccountInline);
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  if (clientEmail && privateKeyRaw) {
    const privateKey = privateKeyRaw.includes("\\n")
      ? privateKeyRaw.replace(/\\n/g, "\n")
      : privateKeyRaw;

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    return;
  }

  initializeApp({ credential: applicationDefault() });
}

async function exportCollection(db, collectionName) {
  const snap = await db.collection(collectionName).get();
  const docs = snap.docs.map((d) => ({
    id: d.id,
    data: toSerializable(d.data()),
  }));

  return { collection: collectionName, count: docs.length, docs };
}

async function main() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, "-");

  const outDir = process.env.MIGRATION_OUTPUT_DIR
    ? path.resolve(process.env.MIGRATION_OUTPUT_DIR)
    : path.resolve(__dirname, "..", "migrations", "phase1", stamp);

  await fs.mkdir(outDir, { recursive: true });

  await initFirebaseAdmin();
  const db = getFirestore();

  const summary = {
    generatedAt: now.toISOString(),
    phase: "phase1",
    collections: {},
  };

  for (const collectionName of PHASE_ONE_COLLECTIONS) {
    const payload = await exportCollection(db, collectionName);
    const outPath = path.join(outDir, `${collectionName}.json`);
    await fs.writeFile(outPath, JSON.stringify(payload, null, 2), "utf8");
    summary.collections[collectionName] = payload.count;
    console.log(`Exported ${collectionName}: ${payload.count}`);
  }

  const summaryPath = path.join(outDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf8");

  console.log("\nPhase 1 export complete.");
  console.log(`Output directory: ${outDir}`);
  console.log(`Summary file: ${summaryPath}`);
}

main().catch((error) => {
  console.error("Phase 1 export failed:", error);
  process.exit(1);
});
