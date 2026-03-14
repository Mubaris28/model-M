import mongoose from "mongoose";

const homepageConfigSchema = new mongoose.Schema(
  {
    newFacesIds:         { type: [mongoose.Schema.Types.ObjectId], default: [] },
    trendingIds:         { type: [mongoose.Schema.Types.ObjectId], default: [] },
    trendingCastingIds:  { type: [mongoose.Schema.Types.ObjectId], default: [] },
    latestIds:           { type: [mongoose.Schema.Types.ObjectId], default: [] },
    latestCount:         { type: Number, default: 0 },
    categoryIds:         { type: Map, of: [mongoose.Schema.Types.ObjectId], default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("HomepageConfig", homepageConfigSchema);
