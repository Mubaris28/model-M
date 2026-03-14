import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function toDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toObjectId(value) {
  if (!value) return undefined;
  if (value instanceof ObjectId) return value;
  if (typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value)) {
    return new ObjectId(value);
  }
  return undefined;
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
  const suffix = String(firebaseUid || "uid").slice(0, 8);
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

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const inputDirArg = readArg("input");
  if (!inputDirArg) {
    console.error("Missing required argument --input=<path-to-transformed-folder>");
    process.exit(1);
  }

  const inputDir = path.resolve(inputDirArg);
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const usersPath = path.join(inputDir, "users.transformed.json");
  const castingsPath = path.join(inputDir, "castings.transformed.json");
  const contactsPath = path.join(inputDir, "contacts.transformed.json");

  const [users, castings, contacts] = await Promise.all([
    readJson(usersPath),
    readJson(castingsPath),
    readJson(contactsPath),
  ]);

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  const usersCollection = db.collection("users");
  const castingsCollection = db.collection("castings");
  const contactsCollection = db.collection("contacts");

  let insertedUsers = 0;
  let updatedUsers = 0;
  let emailCollisionsResolved = 0;

  for (const u of users) {
    const existingByUid = u.firebaseUid
      ? await usersCollection.findOne({ firebaseUid: u.firebaseUid }, { projection: { _id: 1 } })
      : null;
    const resolved = await resolveUniqueEmail(usersCollection, u.email, u.firebaseUid);
    const safeEmail = resolved.email;
    if (resolved.hadCollision) emailCollisionsResolved += 1;

    const setFields = {
      firebaseUid: u.firebaseUid,
      email: safeEmail,
      fullName: u.fullName || "Migrated User",
      phone: u.phone || "",
      role: u.role || "user",
      status: u.status || "pending",
      profileComplete: Boolean(u.profileComplete),
      isAdmin: Boolean(u.isAdmin),
      company: u.company || "",
      rejectionReason: u.rejectionReason || "",
      profilePhoto: u.profilePhoto || "",
      portfolio: Array.isArray(u.portfolio) ? u.portfolio : [],
      idPhotoUrl: u.idPhotoUrl || "",
      selfieWithIdUrl: u.selfieWithIdUrl || "",
      bio: u.bio || "",
      country: u.country || "",
      dateOfBirth: u.dateOfBirth || "",
      gender: u.gender || "",
      city: u.city || "",
      height: u.height || "",
      weight: u.weight || "",
      dressSize: u.dressSize || "",
      shoeSize: u.shoeSize || "",
      eyeColor: u.eyeColor || "",
      hairColor: u.hairColor || "",
      categories: Array.isArray(u.categories) ? u.categories : [],
      instagram: u.instagram || "",
      idNumber: u.idNumber || "",
      legacyFirebaseUser: u.legacyFirebaseUser || null,
      legacyFirebaseModel: u.legacyFirebaseModel || null,
      legacyMergeInfo: u.legacyMergeInfo || {
        hasUserDoc: !!u.legacyFirebaseUser,
        hasModelDoc: !!u.legacyFirebaseModel,
      },
      updatedAt: toDate(u.updatedAt) || new Date(),
    };

    if (existingByUid?._id) {
      await usersCollection.updateOne({ _id: existingByUid._id }, { $set: setFields });
      updatedUsers += 1;
    } else {
      const tempPassword = crypto.randomBytes(16).toString("hex");
      const passwordHash = bcrypt.hashSync(tempPassword, 10);
      const preferredId = toObjectId(u._id);

      await usersCollection.insertOne({
        ...(preferredId ? { _id: preferredId } : {}),
        email: safeEmail,
        password: passwordHash,
        createdAt: toDate(u.createdAt) || new Date(),
        ...setFields,
      });
      insertedUsers += 1;
    }
  }

  let upsertedCastings = 0;
  for (const c of castings) {
    await castingsCollection.updateOne(
      { legacySourceId: c.legacySourceId },
      {
        $set: {
          title: c.title || "Untitled Casting",
          description: c.description || "",
          castingType: c.castingType || "",
          location: c.location || "",
          date: toDate(c.date),
          slots: Number.isFinite(Number(c.slots)) ? Number(c.slots) : 0,
          brand: c.brand || "",
          creatorId: toObjectId(c.creatorId),
          approvalStatus: c.approvalStatus || "pending",
          updatedAt: toDate(c.updatedAt) || new Date(),
        },
        $setOnInsert: {
          legacySourceId: c.legacySourceId,
          createdAt: toDate(c.createdAt) || new Date(),
        },
      },
      { upsert: true }
    );
    upsertedCastings += 1;
  }

  let upsertedContacts = 0;
  for (const c of contacts) {
    await contactsCollection.updateOne(
      { legacySourceId: c.legacySourceId },
      {
        $set: {
          name: c.name || "Unknown",
          email: (c.email || "unknown@example.com").toLowerCase(),
          message: c.message || "",
          updatedAt: toDate(c.updatedAt) || new Date(),
        },
        $setOnInsert: {
          legacySourceId: c.legacySourceId,
          createdAt: toDate(c.createdAt) || new Date(),
        },
      },
      { upsert: true }
    );
    upsertedContacts += 1;
  }

  const report = {
    phase: "phase1",
    mode: "import-from-transformed",
    inputDir,
    users: {
      transformed: users.length,
      insertedUsers,
      updatedUsers,
      emailCollisionsResolved,
    },
    castings: {
      transformed: castings.length,
      upserted: upsertedCastings,
    },
    contacts: {
      transformed: contacts.length,
      upserted: upsertedContacts,
    },
    note: "Passwords are random hashed placeholders for newly inserted users.",
    completedAt: new Date().toISOString(),
  };

  const reportDir = path.resolve(__dirname, "..", "migrations", "phase1");
  await fs.mkdir(reportDir, { recursive: true });
  const reportPath = path.join(reportDir, `import-from-transformed-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("Phase 1 import-from-transformed complete.");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Phase 1 import-from-transformed failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
