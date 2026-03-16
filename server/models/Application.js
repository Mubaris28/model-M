import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    castingId: { type: mongoose.Schema.Types.ObjectId, ref: "Casting", required: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "suggested", "booked", "rejected"],
      default: "pending",
    },
    adminSuggested: { type: Boolean, default: false },
    suggestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ castingId: 1, modelId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
