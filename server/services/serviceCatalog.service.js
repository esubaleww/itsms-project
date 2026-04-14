import ServiceCatalog from "../models/ServiceCatalog.js";
import { getPagination } from "../utils/pagination.js";

export const getAllServices = async (queryParams = {}) => {
  const { page, limit, skip } = getPagination(queryParams);

  const { category, popular, search } = queryParams;

  const filter = { isActive: true };

  if (category && category !== "all") {
    filter.category = category;
  }

  if (popular === "true") {
    filter.popular = true;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const [services, total] = await Promise.all([
    ServiceCatalog.find(filter)
      .sort({ popular: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),

    ServiceCatalog.countDocuments(filter),
  ]);

  const categories = await ServiceCatalog.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  return {
    success: true,
    services,
    categories: [
      { id: "all", name: "All Services", count: total },
      ...categories.map((c) => ({
        id: c._id,
        name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
        count: c.count,
      })),
    ],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

// 🔹 Get single service by ID
export const getServiceById = async (id) => {
  const service = await ServiceCatalog.findById(id);
  if (!service) throw new Error("Service not found");
  return {
    success: true,
    service,
  };
};

// 🔹 Get popular services
export const getPopularServices = async (limit = 5) => {
  return await ServiceCatalog.find({ isActive: true, popular: true })
    .sort({ name: 1 })
    .limit(limit);
};

// 🔹 Get service stats
export const getServiceStats = async () => {
  const [total, popular, byCategory] = await Promise.all([
    ServiceCatalog.countDocuments({ isActive: true }),
    ServiceCatalog.countDocuments({ isActive: true, popular: true }),
    ServiceCatalog.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    total,
    popular,
    byCategory: byCategory.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
  };
};

// 🔹 Admin: Create service
export const createService = async (data) => {
  const existing = await ServiceCatalog.findOne({ name: data.name });
  if (existing) throw new Error("Service with this name already exists");

  const service = new ServiceCatalog(data);
  await service.save();
  return service;
};

// 🔹 Admin: Update service
export const updateService = async (id, data) => {
  const service = await ServiceCatalog.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true },
  );
  if (!service) throw new Error("Service not found");
  return service;
};

// 🔹 Admin: Delete service (soft delete)
export const deleteService = async (id) => {
  const service = await ServiceCatalog.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: new Date() },
    { new: true },
  );
  if (!service) throw new Error("Service not found");
  return service;
};
