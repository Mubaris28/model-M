import mongoose from "mongoose";

const castingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    castingType: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: Date },
    slots: { type: Number, default: 0 },
    brand: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    imageUrls: { type: [String], default: [] },
    price: { type: String, default: "" },
    applicationDeadline: { type: Date },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Casting", castingSchema);
