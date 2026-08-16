import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ==================================================
// USER MANAGEMENT
// ==================================================

/**
 * Get all users
 * GET /api/admin/users
 */
export const getAdminUsers = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `${backendUrl}/api/admin/users?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Get a single user
 * GET /api/admin/users/:id
 */
export const getAdminUserById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/admin/users/${id}`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Update a user
 * PUT /api/admin/users/:id
 */
export const updateAdminUser = async (id, userData) => {
  const { data } = await axios.put(
    `${backendUrl}/api/admin/users/${id}`,
    userData,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Delete a user
 * DELETE /api/admin/users/:id
 */
export const deleteAdminUser = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/admin/users/${id}`, {
    withCredentials: true,
  });

  return data;
};

// ==================================================
// POST MANAGEMENT
// ==================================================

/**
 * Get all posts
 * GET /api/admin/posts
 */
export const getAdminPosts = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `${backendUrl}/api/admin/posts?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Get a single post
 * GET /api/admin/posts/:id
 */
export const getAdminPostById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/admin/posts/${id}`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Update any post
 * PUT /api/admin/posts/:id
 */
export const updateAdminPost = async (id, postData) => {
  const { data } = await axios.put(
    `${backendUrl}/api/admin/posts/${id}`,
    postData,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Delete any post
 * DELETE /api/admin/posts/:id
 */
export const deleteAdminPost = async (id) => {
  const { data } = await axios.delete(`${backendUrl}/api/admin/posts/${id}`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Publish / unpublish a post
 * PATCH /api/admin/posts/:id/status
 */
export const updateAdminPostStatus = async (id, status) => {
  const { data } = await axios.patch(
    `${backendUrl}/api/admin/posts/${id}/status`,
    {
      status,
    },
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Feature / unfeature a post
 * PATCH /api/admin/posts/:id/featured
 */
export const updateAdminPostFeatured = async (id, isFeatured) => {
  const { data } = await axios.patch(
    `${backendUrl}/api/admin/posts/${id}/featured`,
    {
      isFeatured,
    },
    {
      withCredentials: true,
    },
  );

  return data;
};

// ==================================================
// CATEGORY MANAGEMENT
// ==================================================

/**
 * Get all categories
 * GET /api/admin/categories
 */
export const getAdminCategories = async () => {
  const { data } = await axios.get(`${backendUrl}/api/admin/categories`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Get a single category
 * GET /api/admin/categories/:id
 */
export const getAdminCategoryById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/admin/categories/${id}`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Create a category
 * POST /api/admin/categories
 */
export const createAdminCategory = async (categoryData) => {
  const { data } = await axios.post(
    `${backendUrl}/api/admin/categories`,
    categoryData,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Update a category
 * PUT /api/admin/categories/:id
 */
export const updateAdminCategory = async (id, categoryData) => {
  const { data } = await axios.put(
    `${backendUrl}/api/admin/categories/${id}`,
    categoryData,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Delete a category
 * DELETE /api/admin/categories/:id
 */
export const deleteAdminCategory = async (id) => {
  const { data } = await axios.delete(
    `${backendUrl}/api/admin/categories/${id}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Restore a category
 * PATCH /api/admin/categories/:id/restore
 */
export const restoreAdminCategory = async (id) => {
  const { data } = await axios.patch(
    `${backendUrl}/api/admin/categories/${id}/restore`,
    {},
    {
      withCredentials: true,
    },
  );

  return data;
};

// ==================================================
// COMMENT MANAGEMENT
// ==================================================

/**
 * Get all comments
 * GET /api/admin/comments
 */
export const getAdminComments = async (page = 1, limit = 10) => {
  const { data } = await axios.get(
    `${backendUrl}/api/admin/comments?page=${page}&limit=${limit}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

/**
 * Get a single comment
 * GET /api/admin/comments/:id
 */
export const getAdminCommentById = async (id) => {
  const { data } = await axios.get(`${backendUrl}/api/admin/comments/${id}`, {
    withCredentials: true,
  });

  return data;
};

/**
 * Delete a comment
 * DELETE /api/admin/comments/:id
 */
export const deleteAdminComment = async (id) => {
  const { data } = await axios.delete(
    `${backendUrl}/api/admin/comments/${id}`,
    {
      withCredentials: true,
    },
  );

  return data;
};

// ==================================================
// ADMIN DASHBOARD
// ==================================================

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
export const getAdminDashboardStats = async () => {
  const { data } = await axios.get(`${backendUrl}/api/admin/dashboard/stats`, {
    withCredentials: true,
  });

  return data;
};
