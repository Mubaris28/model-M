import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

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

  const tempPassword = crypto.randomBytes(16).toString("hex");
  const passwordHash = bcrypt.hashSync(tempPassword, 10);

  return {
    firebaseUid: uid,
    email,
    password: passwordHash,
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

function splitEmail(email) {
  const at = email.indexOf("@");
  if (at < 0) return { local: email, domain: "" };
  return { local: email.slice(0, at), domain: email.slice(at + 1) };
}

async function resolveUniqueEmail(usersCollection, desiredEmail, firebaseUid) {
  const existing = await usersCollection.findOne(
    { email: desiredEmail },
    { projection: { _id: 1, firebaseUid: 1 } }
  );
  if (!existing) return { email: desiredEmail, hadCollision: false };
  if (existing.firebaseUid && existing.firebaseUid === firebaseUid) {
    return { email: desiredEmail, hadCollision: false };
  }

  const { local, domain } = splitEmail(desiredEmail);
  const suffix = firebaseUid.slice(0, 8);
  let candidate = domain ? `${local}+migrated-${suffix}@${domain}` : `${desiredEmail}-migrated-${suffix}`;
  let idx = 1;

  while (await usersCollection.findOne({ email: candidate }, { projection: { _id: 1 } })) {
    candidate = domain
      ? `${local}+migrated-${suffix}-${idx}@${domain}`
      : `${desiredEmail}-migrated-${suffix}-${idx}`;
    idx += 1;
  }

  return { email: candidate, hadCollision: true };
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

async function main() {
  const inputDirArg = readArg("input");
  const syntheticEmailDomain = readArg("syntheticEmailDomain") || "migrated.local";

  if (!inputDirArg) {
    console.error("Missing required argument --input=<path-to-export-folder>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputDirArg);
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const [usersJson, modelsJson, castingsJson, contactsJson] = await Promise.all([
    readExportFile(inputDir, "users.json"),
    readExportFile(inputDir, "models.json"),
    readExportFile(inputDir, "castings.json"),
    readExportFile(inputDir, "contact-submissions.json"),
  ]);

  const usersByUid = new Map(usersJson.docs.map((d) => [d.id, d.data]));
  const modelsByUid = new Map(modelsJson.docs.map((d) => [d.id, d.data]));

  const allUids = new Set([...usersByUid.keys(), ...modelsByUid.keys()]);

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  const usersCollection = db.collection("users");
  const castingsCollection = db.collection("castings");
  const contactsCollection = db.collection("contacts");

  const firebaseToMongoId = new Map();
  let insertedUsers = 0;
  let updatedUsers = 0;
  let emailCollisionsResolved = 0;

  for (const uid of allUids) {
    const userDoc = usersByUid.get(uid) || null;
    const modelDoc = modelsByUid.get(uid) || null;

    const mapped = mapUserDoc(uid, userDoc, modelDoc, syntheticEmailDomain);

    const existingByUid = await usersCollection.findOne(
      { firebaseUid: uid },
      { projection: { _id: 1 } }
    );

    const resolved = await resolveUniqueEmail(usersCollection, mapped.email, uid);
    const safeEmail = resolved.email;
    if (resolved.hadCollision) emailCollisionsResolved += 1;

    if (existingByUid?._id) {
      await usersCollection.updateOne(
        { _id: existingByUid._id },
        {
          $set: {
            firebaseUid: uid,
            email: safeEmail,
            fullName: mapped.fullName,
            phone: mapped.phone,
            role: mapped.role,
            status: mapped.status,
            profileComplete: mapped.profileComplete,
            isAdmin: mapped.isAdmin,
            company: mapped.company,
            rejectionReason: mapped.rejectionReason,
            profilePhoto: mapped.profilePhoto,
            portfolio: mapped.portfolio,
            idPhotoUrl: mapped.idPhotoUrl,
            selfieWithIdUrl: mapped.selfieWithIdUrl,
            bio: mapped.bio,
            country: mapped.country,
            dateOfBirth: mapped.dateOfBirth,
            gender: mapped.gender,
            city: mapped.city,
            height: mapped.height,
            weight: mapped.weight,
            dressSize: mapped.dressSize,
            shoeSize: mapped.shoeSize,
            eyeColor: mapped.eyeColor,
            hairColor: mapped.hairColor,
            categories: mapped.categories,
            instagram: mapped.instagram,
            idNumber: mapped.idNumber,
            legacyFirebaseUser: mapped.legacyFirebaseUser,
            legacyFirebaseModel: mapped.legacyFirebaseModel,
            legacyMergeInfo: mapped.legacyMergeInfo,
            updatedAt: mapped.updatedAt,
          },
        },
        { upsert: false }
      );
      updatedUsers += 1;
      firebaseToMongoId.set(uid, existingByUid._id);
    } else {
      const insert = await usersCollection.insertOne({
        firebaseUid: uid,
        email: safeEmail,
        password: mapped.password,
        fullName: mapped.fullName,
        phone: mapped.phone,
        role: mapped.role,
        status: mapped.status,
        profileComplete: mapped.profileComplete,
        isAdmin: mapped.isAdmin,
        company: mapped.company,
        rejectionReason: mapped.rejectionReason,
        profilePhoto: mapped.profilePhoto,
        portfolio: mapped.portfolio,
        idPhotoUrl: mapped.idPhotoUrl,
        selfieWithIdUrl: mapped.selfieWithIdUrl,
        bio: mapped.bio,
        country: mapped.country,
        dateOfBirth: mapped.dateOfBirth,
        gender: mapped.gender,
        city: mapped.city,
        height: mapped.height,
        weight: mapped.weight,
        dressSize: mapped.dressSize,
        shoeSize: mapped.shoeSize,
        eyeColor: mapped.eyeColor,
        hairColor: mapped.hairColor,
        categories: mapped.categories,
        instagram: mapped.instagram,
        idNumber: mapped.idNumber,
        legacyFirebaseUser: mapped.legacyFirebaseUser,
        legacyFirebaseModel: mapped.legacyFirebaseModel,
        legacyMergeInfo: mapped.legacyMergeInfo,
        createdAt: mapped.createdAt,
        updatedAt: mapped.updatedAt,
      });
      insertedUsers += 1;
      firebaseToMongoId.set(uid, insert.insertedId);
    }
  }

  let upsertedCastings = 0;
  for (const doc of castingsJson.docs) {
    const mapped = mapCastingDoc(doc.id, doc.data, firebaseToMongoId);
    await castingsCollection.updateOne(
      { legacySourceId: mapped.legacySourceId },
      {
        $set: {
          title: mapped.title,
          description: mapped.description,
          castingType: mapped.castingType,
          location: mapped.location,
          date: mapped.date,
          slots: mapped.slots,
          brand: mapped.brand,
          creatorId: mapped.creatorId,
          approvalStatus: mapped.approvalStatus,
          updatedAt: mapped.updatedAt,
        },
        $setOnInsert: {
          legacySourceId: mapped.legacySourceId,
          createdAt: mapped.createdAt,
        },
      },
      { upsert: true }
    );
    upsertedCastings += 1;
  }

  let upsertedContacts = 0;
  for (const doc of contactsJson.docs) {
    const mapped = mapContactDoc(doc.id, doc.data);
    await contactsCollection.updateOne(
      { legacySourceId: mapped.legacySourceId },
      {
        $set: {
          name: mapped.name,
          email: mapped.email,
          message: mapped.message,
          updatedAt: mapped.updatedAt,
        },
        $setOnInsert: {
          legacySourceId: mapped.legacySourceId,
          createdAt: mapped.createdAt,
        },
      },
      { upsert: true }
    );
    upsertedContacts += 1;
  }

  const report = {
    phase: "phase1",
    inputDir,
    users: {
      sourceUsers: usersJson.count,
      sourceModels: modelsJson.count,
      mergedUniqueUids: allUids.size,
      insertedUsers,
      updatedUsers,
      emailCollisionsResolved,
    },
    castings: {
      source: castingsJson.count,
      upserted: upsertedCastings,
    },
    contacts: {
      source: contactsJson.count,
      upserted: upsertedContacts,
    },
    note: "Passwords are random hashed placeholders. Run password reset flow for migrated users.",
    completedAt: new Date().toISOString(),
  };

  const reportDir = path.resolve(__dirname, "..", "migrations", "phase1");
  await fs.mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `import-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("Phase 1 transform/import complete.");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Phase 1 transform/import failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
