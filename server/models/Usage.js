import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null
    },
    ipAddress: {
      type: String,
      trim: true,
      index: true
    },
    toolName: {
      type: String,
      required: true,
      trim: true,
      enum: ["social-post-generator", "resume-builder", "background-remover"]
    },
    dateKey: {
      type: String,
      required: true,
      index: true
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

usageSchema.index(
  { userId: 1, toolName: 1, dateKey: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $type: "objectId" } }
  }
);

usageSchema.index(
  { ipAddress: 1, toolName: 1, dateKey: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: null, ipAddress: { $type: "string" } }
  }
);

const Usage = mongoose.models.Usage || mongoose.model("Usage", usageSchema);

export default Usage;
