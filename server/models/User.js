import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["user", "model", "professional"], default: "user" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "changes_requested", "updated"],
      default: "pending",
    },
    profileComplete: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    company: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    portfolio: { type: [String], default: [] },
    idPhotoUrl: { type: String, default: "" },
    selfieWithIdUrl: { type: String, default: "" },
    bio: { type: String, default: "" },
    country: { type: String, default: "" },
    // Model application (Step 1)
    dateOfBirth: { type: String, default: "" },
    gender: { type: String, default: "" },
    city: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    eyeColor: { type: String, default: "" },
    hairColor: { type: String, default: "" },
    categories: { type: [String], default: [] },
    instagram: { type: String, default: "" },
    // Model application (Step 2)
    idNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
