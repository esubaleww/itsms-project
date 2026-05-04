import Announcement from "../models/Announcement.js";

import { logAction } from "../utils/auditLogger.js";

export const createAnnouncement = async (admin, data, req) => {
  const announcement = await Announcement.create({
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category,
    image: data.image,
    isFeatured: data.isFeatured || false,
    isPublished: data.isPublished !== undefined ? data.isPublished : true,
    publishedDate: data.publishedDate || new Date(),
    expiryDate: data.expiryDate,
    createdBy: admin._id,
  });

  await logAction({
    user: admin,
    action: "CREATE",
    entity: "Announcement",
    entityId: announcement._id,
    req,
  });

  return { success: true, announcement };
};

export const getPublicAnnouncements = async (filters = {}) => {
  const query = {
    isPublished: true,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: new Date() } },
    ],
  };

  if (filters.category) query.category = filters.category;
  if (filters.featured) query.isFeatured = true;

  const announcements = await Announcement.find(query)
    .sort("-publishedDate")
    .limit(filters.limit || 50);

  return { success: true, announcements };
};
export const getPublicAnnouncementById = async (id) => {
  const announcement = await Announcement.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { returnDocument: "after" },
  ).populate("createdBy", "fullName");

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  if (!announcement.isPublished) {
    throw new Error("Announcement is not available");
  }

  if (
    announcement.expiryDate &&
    new Date(announcement.expiryDate) < new Date()
  ) {
    throw new Error("Announcement has expired");
  }

  return { success: true, announcement };
};

export const getAllAnnouncements = async () => {
  const announcements = await Announcement.find()
    .populate("createdBy", "fullName email")
    .sort("-createdAt");

  return { success: true, announcements };
};

export const updateAnnouncement = async (id, admin, data, req) => {
  const announcement = await Announcement.findById(id);
  if (!announcement) throw new Error("Announcement not found");

  Object.assign(announcement, data);
  await announcement.save();

  await logAction({
    user: admin,
    action: "UPDATE",
    entity: "Announcement",
    entityId: announcement._id,
    req,
  });

  return { success: true, announcement };
};

export const deleteAnnouncement = async (id, admin, req) => {
  const announcement = await Announcement.findByIdAndDelete(id);
  if (!announcement) throw new Error("Announcement not found");

  await logAction({
    user: admin,
    action: "DELETE",
    entity: "Announcement",
    entityId: id,
    req,
  });

  return { success: true, message: "Announcement deleted" };
};
