export const getPagination = (queryParams) => {
  const page = Math.max(parseInt(queryParams.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(queryParams.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
