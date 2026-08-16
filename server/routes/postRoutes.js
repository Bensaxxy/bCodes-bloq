import express from "express";

import {
  createPost,
  getAllPosts,
  getPostBySlug,
  getMyPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getLikeStatus,
} from "../controllers/postController.js";

import userAuth from "../middleware/userAuth.js";

const postRouter = express.Router();

// PUBLIC
postRouter.get("/", getAllPosts);

// AUTHENTICATED
postRouter.get("/my-posts", userAuth, getMyPosts);
postRouter.post("/", userAuth, createPost);
postRouter.put("/:id", userAuth, updatePost);
postRouter.delete("/:id", userAuth, deletePost);

// Likes
postRouter.post("/:id/like", userAuth, likePost);
postRouter.delete("/:id/like", userAuth, unlikePost);
postRouter.get("/:id/like", userAuth, getLikeStatus);

// PUBLIC SINGLE POST
postRouter.get("/:slug", getPostBySlug);

export default postRouter;