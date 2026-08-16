import mongoose from "mongoose";

import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";

import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// Get current authenticated user's profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await userModel
      .findById(userId)
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Update current user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide name or email",
      });
    }

    // Check if email is already being used
    if (email) {
      const existingUser = await userModel.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(email && { email }),
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select(
        "-password -verifyOtp -resetOtp -resetOtpExpireAt -verifyOtpExpireAt",
      );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Delete current user's account and related data
export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await userModel.findById(userId);

    if (user.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
      } catch (error) {
        console.error("Failed to delete profile image from Cloudinary:", error);
      }
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------
    // 1. Find all posts created by the user
    // ------------------------------------------

    const userPosts = await postModel.find({ author: userId }).select("_id");

    const postIds = userPosts.map((post) => post._id);

    // ------------------------------------------
    // 2. Delete comments written by the user
    // ------------------------------------------

    await commentModel.deleteMany({
      author: userId,
    });

    // ------------------------------------------
    // 3. Delete comments belonging to user's posts
    // ------------------------------------------

    if (postIds.length > 0) {
      await commentModel.deleteMany({
        post: { $in: postIds },
      });
    }

    // ------------------------------------------
    // 4. Delete user's posts
    // ------------------------------------------

    await postModel.deleteMany({
      author: userId,
    });

    // ------------------------------------------
    // 5. Remove user's likes from other posts
    // ------------------------------------------

    await postModel.updateMany(
      {
        likedBy: userId,
      },
      {
        $pull: {
          likedBy: userId,
        },
      },
    );

    // ------------------------------------------
    // 6. Delete the user
    // ------------------------------------------

    await userModel.findByIdAndDelete(userId);

    // ------------------------------------------
    // 7. Clear authentication cookie
    // ------------------------------------------

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Account and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user account error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    // Get current user first
    const currentUser = await userModel.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Upload new image to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "profile-images",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadToCloudinary();

    // Delete old image from Cloudinary
    if (currentUser.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(currentUser.profileImagePublicId);
      } catch (error) {
        console.error("Failed to delete old profile image:", error);
      }
    }

    // Save new image information
    const user = await userModel
      .findByIdAndUpdate(
        userId,
        {
          profileImage: result.secure_url,
          profileImagePublicId: result.public_id,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      );

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error("Upload profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Nothing to remove
    if (!user.profileImagePublicId) {
      return res.status(400).json({
        success: false,
        message: "You do not have a profile image",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(user.profileImagePublicId);

    // Remove image information from MongoDB
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        {
          profileImage: "",
          profileImagePublicId: "",
        },
        {
          new: true,
        },
      )
      .select(
        "-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt",
      );

    return res.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Remove profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get current user's profile statistics
export const getUserProfileStats = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Run all statistics queries
    const [totalPosts, publishedPosts, draftPosts, comments, postStats] =
      await Promise.all([
        // Total posts
        postModel.countDocuments({
          author: userId,
        }),

        // Published posts
        postModel.countDocuments({
          author: userId,
          status: "published",
        }),

        // Draft posts
        postModel.countDocuments({
          author: userId,
          status: "draft",
        }),

        // Comments written by the user
        commentModel.countDocuments({
          author: userId,
        }),

        // Likes + views
        postModel.aggregate([
          {
            $match: {
              author: new mongoose.Types.ObjectId(userId),
            },
          },
          {
            $group: {
              _id: null,

              totalLikes: {
                $sum: {
                  $size: "$likedBy",
                },
              },

              totalViews: {
                $sum: "$views",
              },
            },
          },
        ]),
      ]);

    const totalLikes = postStats[0]?.totalLikes || 0;
    const totalViews = postStats[0]?.totalViews || 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments: comments,
        totalLikes,
        totalViews,
      },
    });
  } catch (error) {
    console.error("Get profile stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get another user's public profile
export const getPublicUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find public user information
    const user = await userModel
      .findById(userId)
      .select("name profileImage isAccountVerified createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's posts
    const posts = await postModel
      .find({ author: userId })
      .select("status likedBy views");

    // Get user's comments
    const totalComments = await commentModel.countDocuments({
      author: userId,
    });

    // Calculate statistics
    const totalPosts = posts.length;

    const publishedPosts = posts.filter(
      (post) => post.status === "published",
    ).length;

    const draftPosts = posts.filter(
      (post) => post.status === "draft",
    ).length;

    const totalLikes = posts.reduce(
      (total, post) => total + post.likedBy.length,
      0,
    );

    const totalViews = posts.reduce(
      (total, post) => total + post.views,
      0,
    );

    return res.status(200).json({
      success: true,
      user,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalComments,
        totalLikes,
        totalViews,
      },
    });
  } catch (error) {
    console.error("Get public user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
