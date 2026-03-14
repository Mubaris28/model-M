import "dotenv/config";
import mongoose from "mongoose";

function readArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

async function main() {
  const emailRaw = readArg("email");
  if (!emailRaw) {
    console.error("Missing --email=<user@example.com>");
    process.exit(1);
  }
  const email = emailRaw.trim().toLowerCase();

  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const users = mongoose.connection.db.collection("users");

  const now = new Date();
  const result = await users.updateOne(
    { email },
    { $set: { passwordResetRequired: true, passwordResetRequiredAt: now } }
  );

  const user = await users.findOne(
    { email },
    {
      projection: {
        email: 1,
        firebaseUid: 1,
        role: 1,
        passwordResetRequired: 1,
        passwordResetRequiredAt: 1,
      },
    }
  );

  console.log(
    JSON.stringify(
      {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        user,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("set-force-reset-by-email failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
