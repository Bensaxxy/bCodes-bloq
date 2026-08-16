import express from "express";

import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

import userAuth from "../middleware/userAuth.js";

const commentRouter = express.Router();

// Get comments for a post
commentRouter.get("/:postId", getPostComments);

// Create comment
commentRouter.post("/:postId", userAuth, createComment);

// Update comment
commentRouter.put("/:id", userAuth, updateComment);

// Delete comment
commentRouter.delete("/:id", userAuth, deleteComment);

export default commentRouter;