import postModel from "../models/postModel.js";

// ==================================================
// GET ALL POSTS
// ==================================================
export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100,
    );

    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "";

    const skip = (page - 1) * limit;

    // Build search/filter query
    const filter = {};

    // Search by title, excerpt or content
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          excerpt: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by status
    if (status) {
      if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Use draft or published",
        });
      }

      filter.status = status;
    }

    // Get posts and total count at the same time
    const [posts, totalPosts] = await Promise.all([
      postModel
        .find(filter)
        .populate("author", "name email profileImage")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      postModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin get all posts error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};


// ==================================================
// GET SINGLE POST
// ==================================================
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel
      .findById(id)
      .populate("author", "name email profileImage")
      .populate("category", "name slug");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Admin get post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};


// ==================================================
// UPDATE ANY POST
// ==================================================
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      isFeatured,
    } = req.body;

    // Find post
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check slug uniqueness
    if (slug && slug !== post.slug) {
      const existingPost = await postModel.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingPost) {
        return res.status(400).json({
          success: false,
          message: "A post with this slug already exists",
        });
      }
    }

    // Validate status
    if (
      status !== undefined &&
      !["draft", "published"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use draft or published",
      });
    }

    // Update fields
    if (title !== undefined) {
      post.title = title;
    }

    if (slug !== undefined) {
      post.slug = slug;
    }

    if (excerpt !== undefined) {
      post.excerpt = excerpt;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (coverImage !== undefined) {
      post.coverImage = coverImage;
    }

    if (category !== undefined) {
      post.category = category;
    }

    if (tags !== undefined) {
      post.tags = tags;
    }

    if (isFeatured !== undefined) {
      post.isFeatured = isFeatured;
    }

    // Handle status
    if (status !== undefined) {
      post.status = status;

      if (status === "published" && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      if (status === "draft") {
        post.publishedAt = null;
      }
    }

    await post.save();

    // Return populated updated post
    const updatedPost = await postModel
      .findById(post._id)
      .populate("author", "name email profileImage")
      .populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Admin update post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};


// ==================================================
// DELETE ANY POST
// ==================================================
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};


// ==================================================
// UPDATE POST STATUS
// ==================================================
export const updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use draft or published",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.status = status;

    if (status === "published") {
      if (!post.publishedAt) {
        post.publishedAt = new Date();
      }
    }

    if (status === "draft") {
      post.publishedAt = null;
    }

    await post.save();

    const updatedPost = await postModel
      .findById(post._id)
      .populate("author", "name email profileImage")
      .populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message:
        status === "published"
          ? "Post published successfully"
          : "Post moved to draft successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Admin update post status error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};


// ==================================================
// FEATURE / UNFEATURE POST
// ==================================================
export const updateFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFeatured must be a boolean",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.isFeatured = isFeatured;

    await post.save();

    const updatedPost = await postModel
      .findById(post._id)
      .populate("author", "name email profileImage")
      .populate("category", "name slug");

    return res.status(200).json({
      success: true,
      message: isFeatured
        ? "Post featured successfully"
        : "Post removed from featured posts",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Admin featured post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};