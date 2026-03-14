import "dotenv/config";
import mongoose from "mongoose";

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required in environment.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const users = mongoose.connection.db.collection("users");

  const [
    nonAdminsReset,
    nonAdminsTotal,
    adminsReset,
    adminsTotal,
  ] = await Promise.all([
    users.countDocuments({ isAdmin: { $ne: true }, passwordResetRequired: true }),
    users.countDocuments({ isAdmin: { $ne: true } }),
    users.countDocuments({ isAdmin: true, passwordResetRequired: true }),
    users.countDocuments({ isAdmin: true }),
  ]);

  console.log(
    JSON.stringify(
      {
        nonAdminsReset,
        nonAdminsTotal,
        adminsReset,
        adminsTotal,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("verify-force-reset-counts failed:", error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
