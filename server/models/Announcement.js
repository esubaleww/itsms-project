import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: String,
    category: {
      type: String,
      enum: [
        "announcement",
        "news",
        "event",
        "success_story",
        "opportunity",
        "update",
      ],
      default: "announcement",
    },
    image: {
      type: {
        url: String,
        public_id: String,
        name: String,
        size: Number,
        mimeType: String,
        isImage: Boolean,
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

announcementSchema.index({ isPublished: 1, publishedDate: -1 });
announcementSchema.index({ category: 1, publishedDate: -1 });

export default mongoose.model("Announcement", announcementSchema);
