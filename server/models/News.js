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

    // 🔹 New fields
    views: { type: Number, default: 0 }, // track number of views
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // track which users liked
  },
  { timestamps: true }
);

// 🔹 Text index for search
newsSchema.index({ title: "text", description: "text", content: "text" });
newsSchema.index({ category: 1 });

// 🔹 Virtual field for like count
newsSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// 🔹 Method to toggle like
newsSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId); // like
  } else {
    this.likes.splice(index, 1); // unlike
  }
  await this.save();
  return this;
};

// 🔹 Method to increment views
newsSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
  return this.views;
};

export default mongoose.model("News", newsSchema);
