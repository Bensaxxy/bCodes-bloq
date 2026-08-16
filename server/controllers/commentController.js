import commentModel from "../models/commentModel.js";
import postModel from "../models/postModel.js";

// =====================================================
// CREATE COMMENT
// POST /api/comments/:postId
// =====================================================
export const createComment = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { post, content, parentComment } = req.body;

    if (!post || !content) {
      return res.status(400).json({
        success: false,
        message: "Post and content are required",
      });
    }

    // Check post
    const existingPost = await postModel.findById(post);

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // If replying, check parent comment
    if (parentComment) {
      const existingComment = await commentModel.findById(parentComment);

      if (!existingComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }

      // Make sure reply belongs to same post
      if (existingComment.post.toString() !== post.toString()) {
        return res.status(400).json({
          success: false,
          message: "Parent comment does not belong to this post",
        });
      }
    }

    const comment = await commentModel.create({
      post,
      author: userId,
      content,
      parentComment: parentComment || null,
    });

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate("author", "name email");

    return res.status(201).json({
      success: true,
      message: parentComment
        ? "Reply added successfully"
        : "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// =====================================================
// GET COMMENTS FOR A POST
// GET /api/comments/:postId
// =====================================================
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Get comments
    const comments = await commentModel
      .find({ post: postId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      comments,
      totalComments: comments.length,
    });
  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// =====================================================
// UPDATE COMMENT
// PUT /api/comments/:id
// =====================================================
export const updateComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { content } = req.body;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validate content
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    // Find comment
    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this comment",
      });
    }

    // Update comment
    comment.content = content.trim();

    await comment.save();

    // Populate author
    const updatedComment = await commentModel
      .findById(comment._id)
      .populate("author", "name email");

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Update comment error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// =====================================================
// DELETE COMMENT
// DELETE /api/comments/:id
// =====================================================
export const deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Check authentication
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find comment
    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    // Delete comment
    await commentModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};
