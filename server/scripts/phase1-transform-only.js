import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import { ObjectId } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function parseIsoDate(value) {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function mapStatus(status) {
  if (!status || typeof status !== "string") return "pending";
  if (status === "changesRequested") return "changes_requested";
  if (["pending", "approved", "rejected", "changes_requested", "updated"].includes(status)) {
    return status;
  }
  return "pending";
}

function normalizeRole(userDoc, modelDoc) {
  const role = userDoc?.role;

  if (role === "professional" || userDoc?.isProfessional) return "professional";
  if (role === "model") return "model";
  if (role === "admin") return "user";
  if (modelDoc) return "model";
  return "user";
}

function chooseFullName(userDoc, modelDoc, fallbackEmail) {
  const fullNameCandidates = [
    userDoc?.fullName,
    userDoc?.name,
    userDoc?.displayName,
    userDoc?.profile?.personalInfo?.fullName,
    [modelDoc?.firstName, modelDoc?.lastName].filter(Boolean).join(" "),
    modelDoc?.name,
    userDoc?.email,
    fallbackEmail,
  ];

  return fullNameCandidates.find((v) => typeof v === "string" && v.trim().length > 0)?.trim() || "Migrated User";
}

function pickArray(value) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string" && v.trim()) : [];
}

function stableObjectIdFromUid(uid) {
  // Deterministic 24-hex ID derived from UID for transform-only references.
  const hex = crypto.createHash("md5").update(uid).digest("hex").slice(0, 24);
  return new ObjectId(hex);
}

function mapUserDoc(uid, userDoc, modelDoc, syntheticEmailDomain) {
  const baseEmail = (userDoc?.email || "").toLowerCase().trim();
  const email = baseEmail || `${uid}@${syntheticEmailDomain}`;

  const role = normalizeRole(userDoc, modelDoc);
  const isAdmin = userDoc?.isAdmin === true || userDoc?.role === "admin";

  const portfolioFromUser = (userDoc?.portfolioPhotos || []).map((p) => p?.url).filter(Boolean);
  const portfolioFromModel = pickArray(modelDoc?.portfolioImages);

  const fullName = chooseFullName(userDoc, modelDoc, email);

  const createdAt = parseIsoDate(userDoc?.createdAt) || parseIsoDate(modelDoc?.createdAt) || new Date();
  const updatedAt = parseIsoDate(userDoc?.updatedAt) || parseIsoDate(modelDoc?.updatedAt) || createdAt;

  return {
    firebaseUid: uid,
    email,
    fullName,
    phone: userDoc?.phone || modelDoc?.phone || "",
    role,
    status: mapStatus(userDoc?.status || modelDoc?.approvalStatus),
    profileComplete: Boolean(userDoc?.hasCompletedRegistration || modelDoc?.step2Complete || userDoc?.profileComplete),
    isAdmin,
    company: userDoc?.companyName || userDoc?.company || userDoc?.profile?.professionalInfo?.companyName || "",
    rejectionReason: userDoc?.rejectionReason || "",
    profilePhoto: userDoc?.profilePicture || userDoc?.profilePhoto || userDoc?.profile?.publicInfo?.profilePhotoUrl || "",
    portfolio: portfolioFromUser.length ? portfolioFromUser : portfolioFromModel,
    idPhotoUrl: modelDoc?.idPhotoUrl || userDoc?.idPhotoUrl || "",
    selfieWithIdUrl: modelDoc?.selfieUrl || userDoc?.selfieWithIdUrl || "",
    bio: modelDoc?.about || modelDoc?.bio || userDoc?.bio || "",
    country: userDoc?.country || modelDoc?.nationality || "",
    dateOfBirth: modelDoc?.dateOfBirth || userDoc?.dateOfBirth || "",
    gender: modelDoc?.gender || userDoc?.gender || "",
    city: userDoc?.city || modelDoc?.location || "",
    height: String(modelDoc?.height || userDoc?.height || ""),
    weight: String(userDoc?.weight || ""),
    dressSize: String(modelDoc?.dressSize || userDoc?.dressSize || ""),
    shoeSize: String(modelDoc?.shoeSize || userDoc?.shoeSize || ""),
    eyeColor: modelDoc?.eyeColor || userDoc?.eyeColor || "",
    hairColor: modelDoc?.hairColor || userDoc?.hairColor || "",
    categories: pickArray(modelDoc?.categories || userDoc?.categories),
    instagram: modelDoc?.socialMedia?.instagram || userDoc?.instagram || "",
    idNumber: modelDoc?.idNumber || userDoc?.idNumber || "",
    legacyFirebaseUser: userDoc,
    legacyFirebaseModel: modelDoc,
    legacyMergeInfo: {
      hasUserDoc: !!userDoc,
      hasModelDoc: !!modelDoc,
    },
    createdAt,
    updatedAt,
  };
}

function mapCastingDoc(castingSourceId, doc, firebaseToMongoId) {
  const creatorUid = doc.createdBy || doc.clientId || doc.recruiterId || "";
  const creatorId = creatorUid && firebaseToMongoId.has(creatorUid) ? firebaseToMongoId.get(creatorUid) : undefined;

  const approvalRaw = doc.approvalStatus || doc.status || "pending";
  const approvalStatus = ["pending", "approved", "rejected"].includes(approvalRaw) ? approvalRaw : "pending";

  const date = parseIsoDate(doc.shootDate) || parseIsoDate(doc.date) || undefined;

  return {
    legacySourceId: castingSourceId,
    title: doc.title || "Untitled Casting",
    description: doc.description || "",
    castingType: doc.castingType || doc.jobType || "",
    location: doc.location || doc.targetLocation?.value || "",
    date,
    slots: Number.isFinite(Number(doc.slots)) ? Number(doc.slots) : 0,
    brand: doc.brand || doc.companyName || "",
    creatorId,
    approvalStatus,
    createdAt: parseIsoDate(doc.createdAt) || new Date(),
    updatedAt: parseIsoDate(doc.updatedAt) || parseIsoDate(doc.createdAt) || new Date(),
  };
}

function mapContactDoc(sourceId, doc) {
  return {
    legacySourceId: sourceId,
    name: doc.name || doc.fullName || "Unknown",
    email: (doc.email || "unknown@example.com").toLowerCase(),
    message: doc.message || doc.note || doc.content || "",
    createdAt: parseIsoDate(doc.createdAt) || new Date(),
    updatedAt: parseIsoDate(doc.updatedAt) || parseIsoDate(doc.createdAt) || new Date(),
  };
}

async function readExportFile(dir, fileName) {
  const fullPath = path.join(dir, fileName);
  const raw = await fs.readFile(fullPath, "utf8");
  return JSON.parse(raw);
}

function jsonReplacer(_key, value) {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof ObjectId) return value.toHexString();
  return value;
}

async function main() {
  const inputDirArg = readArg("input");
  const outArg = readArg("out");
  const syntheticEmailDomain = readArg("syntheticEmailDomain") || "migrated.local";

  if (!inputDirArg) {
    console.error("Missing required argument --input=<path-to-export-folder>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputDirArg);
  const outDir = outArg
    ? path.resolve(outArg)
    : path.resolve(__dirname, "..", "migrations", "phase1-transformed", path.basename(inputDir));

  const [usersJson, modelsJson, castingsJson, contactsJson] = await Promise.all([
    readExportFile(inputDir, "users.json"),
    readExportFile(inputDir, "models.json"),
    readExportFile(inputDir, "castings.json"),
    readExportFile(inputDir, "contact-submissions.json"),
  ]);

  const usersByUid = new Map(usersJson.docs.map((d) => [d.id, d.data]));
  const modelsByUid = new Map(modelsJson.docs.map((d) => [d.id, d.data]));

  const allUids = new Set([...usersByUid.keys(), ...modelsByUid.keys()]);
  const firebaseToMongoId = new Map();

  const transformedUsers = [];
  for (const uid of allUids) {
    const userDoc = usersByUid.get(uid) || null;
    const modelDoc = modelsByUid.get(uid) || null;
    const mapped = mapUserDoc(uid, userDoc, modelDoc, syntheticEmailDomain);

    const objectId = stableObjectIdFromUid(uid);
    firebaseToMongoId.set(uid, objectId);

    transformedUsers.push({
      _id: objectId,
      ...mapped,
    });
  }

  const transformedCastings = castingsJson.docs.map((d) => ({
    ...mapCastingDoc(d.id, d.data, firebaseToMongoId),
  }));

  const transformedContacts = contactsJson.docs.map((d) => ({
    ...mapContactDoc(d.id, d.data),
  }));

  const uidMap = Object.fromEntries(
    [...firebaseToMongoId.entries()].map(([uid, id]) => [uid, id.toHexString()])
  );

  await fs.mkdir(outDir, { recursive: true });

  const usersOut = path.join(outDir, "users.transformed.json");
  const castingsOut = path.join(outDir, "castings.transformed.json");
  const contactsOut = path.join(outDir, "contacts.transformed.json");
  const uidMapOut = path.join(outDir, "uid-map.json");
  const reportOut = path.join(outDir, "transform-report.json");

  await Promise.all([
    fs.writeFile(usersOut, JSON.stringify(transformedUsers, jsonReplacer, 2), "utf8"),
    fs.writeFile(castingsOut, JSON.stringify(transformedCastings, jsonReplacer, 2), "utf8"),
    fs.writeFile(contactsOut, JSON.stringify(transformedContacts, jsonReplacer, 2), "utf8"),
    fs.writeFile(uidMapOut, JSON.stringify(uidMap, null, 2), "utf8"),
  ]);

  const report = {
    phase: "phase1",
    mode: "transform-only",
    inputDir,
    outputDir: outDir,
    users: {
      sourceUsers: usersJson.count,
      sourceModels: modelsJson.count,
      mergedUniqueUids: allUids.size,
      transformed: transformedUsers.length,
    },
    castings: {
      source: castingsJson.count,
      transformed: transformedCastings.length,
    },
    contacts: {
      source: contactsJson.count,
      transformed: transformedContacts.length,
    },
    generatedAt: new Date().toISOString(),
  };

  await fs.writeFile(reportOut, JSON.stringify(report, null, 2), "utf8");

  console.log("Phase 1 transform-only complete.");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Output files written to: ${outDir}`);
}

main().catch((error) => {
  console.error("Phase 1 transform-only failed:", error);
  process.exit(1);
});
