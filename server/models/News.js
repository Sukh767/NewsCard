import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Sports", "Politics", "Entertainment", "Health", "Business"],
    },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", description: "text", content: "text" });
newsSchema.index({ category: 1 });

export default mongoose.model("News", newsSchema);
