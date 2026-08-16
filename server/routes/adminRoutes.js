import express from "express";

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

import {
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus,
  updateFeaturedStatus,
} from "../controllers/adminPostController.js";

import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  restoreCategory,
  updateCategory,
} from "../controllers/adminCategoryController.js";
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import {
  deleteComment,
  getAllComments,
  getCommentById,
} from "../controllers/adminCommentController.js";
import validateObjectId from "../middleware/validateObjectId.js";

const adminRouter = express.Router();

// ==================================================
// USER MANAGEMENT
// ==================================================

// Get all users
adminRouter.get("/users", userAuth, adminAuth, getAllUsers);

// Get single user
adminRouter.get(
  "/users/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  getUserById,
);

// Update user
adminRouter.put(
  "/users/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  updateUser,
);

// Delete user
adminRouter.delete(
  "/users/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  deleteUser,
);

// ==================================================
// POST MANAGEMENT
// ==================================================

// Get all posts
adminRouter.get("/posts", userAuth, adminAuth, getAllPosts);

// Get single post
adminRouter.get(
  "/posts/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  getPostById,
);

// Update any post
adminRouter.put(
  "/posts/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  updatePost,
);

// Delete any post
adminRouter.delete(
  "/posts/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  deletePost,
);

// Publish / unpublish post
adminRouter.patch(
  "/posts/:id/status",
  userAuth,
  adminAuth,
  validateObjectId(),
  updatePostStatus,
);

// Feature / unfeature post
adminRouter.patch(
  "/posts/:id/featured",
  userAuth,
  adminAuth,
  validateObjectId(),
  updateFeaturedStatus,
);

// ==================================================
// CATEGORY MANAGEMENT
// ==================================================

// Get all categories
adminRouter.get("/categories", userAuth, adminAuth, getAllCategories);

// Get single category
adminRouter.get(
  "/categories/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  getCategoryById,
);

// Create category
adminRouter.post("/categories", userAuth, adminAuth, createCategory);

// Update category
adminRouter.put(
  "/categories/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  updateCategory,
);

// Delete category
adminRouter.delete(
  "/categories/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  deleteCategory,
);

// Restore category
adminRouter.patch(
  "/categories/:id/restore",
  userAuth,
  adminAuth,
  validateObjectId(),
  restoreCategory,
);

// ==================================================
// ADMIN DASHBOARD
// ==================================================

adminRouter.get("/dashboard/stats", userAuth, adminAuth, getDashboardStats);

// ====================================
// COMMENT MANAGEMENT
// ====================================

// Get all comments
adminRouter.get("/comments", userAuth, adminAuth, getAllComments);

// Get single comment
adminRouter.get(
  "/comments/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  getCommentById,
);

// Delete comment
adminRouter.delete(
  "/comments/:id",
  userAuth,
  adminAuth,
  validateObjectId(),
  deleteComment,
);

export default adminRouter;
