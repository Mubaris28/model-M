import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

function readBoolArg(name, defaultValue) {
  const value = readArg(name);
  if (value == null) return defaultValue;
  return value === "true";
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  const rotate = readBoolArg("rotate", true);
  const includeAdmins = readBoolArg("includeAdmins", false);
  const allUsers = readBoolArg("allUsers", false);

  const baseFilter = allUsers
    ? {
        ...(includeAdmins ? {} : { isAdmin: { $ne: true } }),
      }
    : {
        firebaseUid: { $exists: true, $ne: null },
        ...(includeAdmins ? {} : { isAdmin: { $ne: true } }),
      };

  await mongoose.connect(mongoUri);
  const users = mongoose.connection.collection("users");

  const totalTargets = await users.countDocuments(baseFilter);
  if (!totalTargets) {
    console.log("No users matched filter. Nothing to update.");
    await mongoose.disconnect();
    return;
  }

  const now = new Date();
  let updated = 0;

  if (!rotate) {
    const result = await users.updateMany(
      baseFilter,
      {
        $set: {
          passwordResetRequired: true,
          passwordResetRequiredAt: now,
        },
      }
    );
    updated = result.modifiedCount;
  } else {
    const cursor = users.find(baseFilter, { projection: { _id: 1 } });
    while (await cursor.hasNext()) {
      const u = await cursor.next();
      const random = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(random, 10);

      await users.updateOne(
        { _id: u._id },
        {
          $set: {
            password: hash,
            passwordResetRequired: true,
            passwordResetRequiredAt: now,
            passwordResetTokenHash: "",
            passwordResetTokenExpiresAt: null,
          },
        }
      );

      updated += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        matchedUsers: totalTargets,
        updatedUsers: updated,
        rotatePasswords: rotate,
        includeAdmins,
        allUsers,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("force-password-reset-migrated failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
