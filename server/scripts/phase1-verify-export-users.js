import fs from "node:fs/promises";
import path from "node:path";

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function normalizeEmail(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

async function main() {
  const inputDirArg = readArg("input");
  if (!inputDirArg) {
    console.error("Missing required argument --input=<path-to-export-folder>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputDirArg);
  const [usersJson, modelsJson] = await Promise.all([
    readJson(path.join(inputDir, "users.json")),
    readJson(path.join(inputDir, "models.json")),
  ]);

  const usersByUid = new Map(usersJson.docs.map((d) => [d.id, d.data || {}]));
  const modelsByUid = new Map(modelsJson.docs.map((d) => [d.id, d.data || {}]));
  const allUids = new Set([...usersByUid.keys(), ...modelsByUid.keys()]);

  const userOnlyUids = [...usersByUid.keys()].filter((uid) => !modelsByUid.has(uid));
  const modelOnlyUids = [...modelsByUid.keys()].filter((uid) => !usersByUid.has(uid));

  const emailToUids = new Map();
  for (const uid of allUids) {
    const userDoc = usersByUid.get(uid) || null;
    const email = normalizeEmail(userDoc?.email);
    if (!email) continue;
    if (!emailToUids.has(email)) emailToUids.set(email, []);
    emailToUids.get(email).push(uid);
  }

  const duplicateEmails = [...emailToUids.entries()]
    .filter(([, uids]) => uids.length > 1)
    .map(([email, uids]) => ({ email, uids }));

  const usersMissingEmail = [...usersByUid.entries()]
    .filter(([, data]) => !normalizeEmail(data?.email))
    .map(([uid]) => uid);

  const report = {
    inputDir,
    sourceCounts: {
      usersCollectionDocs: usersJson.count,
      modelsCollectionDocs: modelsJson.count,
      mergedUniqueUids: allUids.size,
      userOnlyUids: userOnlyUids.length,
      modelOnlyUids: modelOnlyUids.length,
    },
    dataQuality: {
      usersMissingEmail: usersMissingEmail.length,
      duplicateEmailsAcrossUids: duplicateEmails.length,
    },
    samples: {
      firstModelOnlyUids: modelOnlyUids.slice(0, 20),
      firstUsersMissingEmail: usersMissingEmail.slice(0, 20),
      firstDuplicateEmails: duplicateEmails.slice(0, 20),
    },
    generatedAt: new Date().toISOString(),
  };

  const outPath = path.join(inputDir, "verify-users-report.json");
  await fs.writeFile(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.log(`Report written: ${outPath}`);
}

main().catch((error) => {
  console.error("phase1 verify users failed:", error);
  process.exit(1);
});
