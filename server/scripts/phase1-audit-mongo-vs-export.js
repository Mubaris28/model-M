import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const inputDirArg = readArg("input");
  if (!inputDirArg) {
    console.error("Missing required argument --input=<path-to-export-folder>");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const inputDir = path.resolve(inputDirArg);

  const [usersJson, modelsJson] = await Promise.all([
    readJson(path.join(inputDir, "users.json")),
    readJson(path.join(inputDir, "models.json")),
  ]);

  const sourceUidSet = new Set([
    ...usersJson.docs.map((d) => d.id),
    ...modelsJson.docs.map((d) => d.id),
  ]);

  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const users = db.collection("users");

  const collections = await db.listCollections().toArray();
  const hasModelsCollection = collections.some((c) => c.name === "models");

  const [
    totalUsers,
    modelRoleUsers,
    professionalRoleUsers,
    modelProfilesComplete,
    modelProfilesPending,
    modelProfilesApproved,
    modelRoleWithUid,
    modelRoleNoUid,
  ] = await Promise.all([
    users.countDocuments({}),
    users.countDocuments({ role: "model" }),
    users.countDocuments({ role: "professional" }),
    users.countDocuments({ role: "model", profileComplete: true }),
    users.countDocuments({ role: "model", status: "pending" }),
    users.countDocuments({ role: "model", status: "approved" }),
    users.countDocuments({ role: "model", firebaseUid: { $exists: true, $ne: null } }),
    users.countDocuments({
      role: "model",
      $or: [{ firebaseUid: { $exists: false } }, { firebaseUid: null }, { firebaseUid: "" }],
    }),
  ]);

  const modelsCollectionCount = hasModelsCollection
    ? await db.collection("models").countDocuments({})
    : null;

  const mongoUidDocs = await users
    .find({ firebaseUid: { $exists: true, $ne: null } }, { projection: { firebaseUid: 1, email: 1, role: 1 } })
    .toArray();

  const mongoUidSet = new Set(mongoUidDocs.map((d) => d.firebaseUid));
  const missingFromMongo = [...sourceUidSet].filter((uid) => !mongoUidSet.has(uid));

  const duplicateFirebaseUidRows = await users
    .aggregate([
      { $match: { firebaseUid: { $exists: true, $ne: null } } },
      { $group: { _id: "$firebaseUid", n: { $sum: 1 }, emails: { $push: "$email" } } },
      { $match: { n: { $gt: 1 } } },
      { $limit: 50 },
    ])
    .toArray();

  const report = {
    inputDir,
    source: {
      usersDocs: usersJson.count,
      modelsDocs: modelsJson.count,
      mergedUniqueUids: sourceUidSet.size,
    },
    mongo: {
      totalUsers,
      modelRoleUsers,
      professionalRoleUsers,
      modelProfilesComplete,
      modelProfilesPending,
      modelProfilesApproved,
      modelRoleWithUid,
      modelRoleNoUid,
      hasModelsCollection,
      modelsCollectionCount,
    },
    reconciliation: {
      mongoUsersWithFirebaseUid: mongoUidSet.size,
      missingFromMongoCount: missingFromMongo.length,
      missingFromMongoSample: missingFromMongo.slice(0, 50),
      duplicateFirebaseUidRows: duplicateFirebaseUidRows.length,
      duplicateFirebaseUidSample: duplicateFirebaseUidRows,
    },
    generatedAt: new Date().toISOString(),
  };

  const outPath = path.join(inputDir, "mongo-vs-export-audit.json");
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log(`Report written: ${outPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("phase1 audit mongo vs export failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
