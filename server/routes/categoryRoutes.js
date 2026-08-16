import express from "express";

import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import userAuth from "../middleware/userAuth.js";

const categoryRouter = express.Router();

// Public routes
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:slug", getCategoryBySlug);


// Authenticated routes
categoryRouter.post("/", userAuth, createCategory);

categoryRouter.put("/:id", userAuth, updateCategory);

categoryRouter.delete("/:id", userAuth, deleteCategory);

export default categoryRouter;