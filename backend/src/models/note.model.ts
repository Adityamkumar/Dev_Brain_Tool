import mongoose from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  type: "error" | "snippet";
  tags?: string[];
  sourceUrl?: string;
  createdAt: Date;
}

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type:String,
      enum: ["error", "snippet"],
      required: true
    },
    tags: {
      type: [String],
      default: [],
    },
    sourceUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ content: "text" });

export const Note = mongoose.model<INote>("Note", noteSchema);
