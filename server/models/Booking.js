import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    castingId: { type: mongoose.Schema.Types.ObjectId, ref: "Casting", required: true },
    modelId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    professionalId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", default: null },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
