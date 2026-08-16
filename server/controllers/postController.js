import postModel from "../models/postModel.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

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

    // Required fields
    if (!title || !slug || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, excerpt, content and category are required",
      });
    }

    // Check if slug already exists
    const existingPost = await postModel.findOne({ slug });

    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "A post with this slug already exists",
      });
    }

    const post = await postModel.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || "",
      author: userId,
      category,
      tags: tags || [],
      status: status || "draft",
      isFeatured: isFeatured || false,
      publishedAt: status === "published" ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Get all published posts with search + pagination
export const getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    // Convert query values to numbers
    const currentPage = Math.max(Number(page) || 1, 1);

    // Prevent excessively large requests
    const postsPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      50,
    );

    // Calculate how many posts to skip
    const skip = (currentPage - 1) * postsPerPage;

    // Base query
    const query = {
      status: "published",
    };

    // Add search condition if search exists
    if (search.trim()) {
      query.$text = {
        $search: search.trim(),
      };
    }

    // Get posts
    const posts = await postModel
      .find(query)
      .populate("author", "name email profileImage")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(postsPerPage);

    // Count matching posts
    const totalPosts = await postModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(
      totalPosts / postsPerPage,
    );

    return res.status(200).json({
      success: true,
      posts,

      pagination: {
        currentPage,
        totalPages,
        totalPosts,
        limit: postsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },

      search: search.trim(),
    });
  } catch (error) {
    console.error("Get all posts error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

// Get a single post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await postModel
      .findOne({
        slug,
        status: "published",
      })
      .populate("author", "name email profileImage bio")
      .populate("category", "name slug");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increase views
    post.views += 1;

    await post.save();

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Get current user's posts
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const posts = await postModel
      .find({ author: userId })
      .populate("author", "name email profileImage")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Get my posts error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

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

    // Find the post
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only the author who created the post can update it
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this post",
      });
    }

    // Check slug if it is being changed
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

    // Update fields
    if (title !== undefined) post.title = title;
    if (slug !== undefined) post.slug = slug;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (content !== undefined) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;

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
    console.error("Update post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only the author who created the post can delete it
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already liked the post
    const alreadyLiked = post.likedBy.some(
      (user) => user.toString() === userId.toString(),
    );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "You already liked this post",
        likes: post.likedBy.length,
        liked: true,
      });
    }

    // Add user to likedBy
    post.likedBy.push(userId);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: post.likedBy.length,
      liked: true,
    });
  } catch (error) {
    console.error("Like post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user actually liked the post
    const alreadyLiked = post.likedBy.some(
      (user) => user.toString() === userId.toString(),
    );

    if (!alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "You have not liked this post",
        likes: post.likedBy.length,
        liked: false,
      });
    }

    // Remove user from likedBy
    post.likedBy = post.likedBy.filter(
      (user) => user.toString() !== userId.toString(),
    );

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
      likes: post.likedBy.length,
      liked: false,
    });
  } catch (error) {
    console.error("Unlike post error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// Get like status for a post
export const getLikeStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const post = await postModel.findById(id).select("likedBy");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const liked = post.likedBy.some(
      (user) => user.toString() === userId.toString(),
    );

    return res.status(200).json({
      success: true,
      liked,
      likes: post.likedBy.length,
    });
  } catch (error) {
    console.error("Get like status error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};