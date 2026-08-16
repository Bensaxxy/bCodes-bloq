import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateProfileImage,
  removeProfileImage,
  getUserProfileStats,
  getPublicUserProfile,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

// Get current user
userRouter.get("/profile", userAuth, getUserProfile);
// Update current user
userRouter.put("/profile", userAuth, updateUserProfile);
// Delete current user
userRouter.delete("/profile", userAuth, deleteUserAccount);

userRouter.put(
  "/profile/image",
  userAuth,
  upload.single("image"),
  updateProfileImage,
);

userRouter.delete("/profile/image", userAuth, removeProfileImage);

userRouter.get("/profile/stats", userAuth, getUserProfileStats);

// Get another user's public profile
userRouter.get("/:userId", getPublicUserProfile);

export default userRouter;  
