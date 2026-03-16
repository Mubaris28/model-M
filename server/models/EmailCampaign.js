import mongoose from "mongoose";

const failedRecipientSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    error: { type: String, default: "" },
  },
  { _id: false }
);

const emailCampaignSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    filters: {
      roles: { type: [String], default: [] },
      statuses: { type: [String], default: [] },
      profileCompleteOnly: { type: Boolean, default: false },
      genders: { type: [String], default: [] },
    },
    specificEmails: { type: [String], default: [] },
    useFilters: { type: Boolean, default: true },
    useSpecific: { type: Boolean, default: false },
    provider: { type: String, default: "resend" },
    usedBulkApi: { type: Boolean, default: false },
    recipientCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    recipientSample: { type: [String], default: [] },
    failedRecipients: { type: [failedRecipientSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("EmailCampaign", emailCampaignSchema);