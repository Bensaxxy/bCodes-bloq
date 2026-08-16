import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
import categoryModel from "../models/categoryModel.js";
import commentModel from "../models/commentModel.js";

// ==================================================
// GET ADMIN DASHBOARD STATISTICS
// ==================================================
export const getDashboardStats = async (req, res) => {
  try {
    // Run independent database queries at the same time
    const [
      totalUsers,
      totalAdmins,
      verifiedUsers,
      unverifiedUsers,

      totalPosts,
      publishedPosts,
      draftPosts,

      totalCategories,
      activeCategories,
      inactiveCategories,

      totalComments,
    ] = await Promise.all([
      // ------------------------------------------
      // USERS
      // ------------------------------------------

      userModel.countDocuments({
        role: "user",
      }),

      userModel.countDocuments({
        role: "admin",
      }),

      userModel.countDocuments({
        role: "user",
        isAccountVerified: true,
      }),

      userModel.countDocuments({
        role: "user",
        isAccountVerified: false,
      }),

      // ------------------------------------------
      // POSTS
      // ------------------------------------------

      postModel.countDocuments(),

      postModel.countDocuments({
        status: "published",
      }),

      postModel.countDocuments({
        status: "draft",
      }),

      // ------------------------------------------
      // CATEGORIES
      // ------------------------------------------

      categoryModel.countDocuments(),

      categoryModel.countDocuments({
        isActive: true,
      }),

      categoryModel.countDocuments({
        isActive: false,
      }),

      // ------------------------------------------
      // COMMENTS
      // ------------------------------------------

      commentModel.countDocuments(),
    ]);

    // ------------------------------------------
    // TOTAL LIKES
    // ------------------------------------------
    const likesResult = await postModel.aggregate([
      {
        $project: {
          likesCount: {
            $size: {
              $ifNull: ["$likedBy", []],
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: {
            $sum: "$likesCount",
          },
        },
      },
    ]);

    const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;

    // ------------------------------------------
    // TOTAL VIEWS
    // ------------------------------------------
    const viewsResult = await postModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: "$views",
          },
        },
      },
    ]);

    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------
    return res.status(200).json({
      success: true,

      stats: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
        },

        posts: {
          total: totalPosts,
          published: publishedPosts,
          drafts: draftPosts,
        },

        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: inactiveCategories,
        },

        comments: {
          total: totalComments,
        },

        likes: {
          total: totalLikes,
        },

        views: {
          total: totalViews,
        },
      },
    });
  } catch (error) {
    console.error("Get admin dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};
