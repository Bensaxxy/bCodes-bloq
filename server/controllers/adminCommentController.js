import commentModel from "../models/commentModel.js";

// ------------------------------------
// GET ALL COMMENTS
// ------------------------------------
export const getAllComments = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    const skip = (safePage - 1) * safeLimit;

    const comments = await commentModel
      .find()
      .populate("author", "name email profileImage")
      .populate("post", "title slug")
      .populate("parentComment", "content author")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit);

    const totalComments = await commentModel.countDocuments();

    return res.status(200).json({
      success: true,
      comments,
      pagination: {
        currentPage: safePage,
        totalPages: Math.ceil(totalComments / safeLimit),
        totalComments,
        limit: safeLimit,
      },
    });
  } catch (error) {
    console.error("Get all comments error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ------------------------------------
// GET SINGLE COMMENT
// ------------------------------------
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentModel
      .findById(id)
      .populate("author", "name email profileImage")
      .populate("post", "title slug")
      .populate("parentComment", "content author");

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    return res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error("Get comment error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ------------------------------------
// DELETE COMMENT
// ------------------------------------
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await commentModel.findByIdAndDelete(id);

    // If other comments are replies to this comment,
    // remove the parent reference so they don't point
    // to a deleted comment.
    await commentModel.updateMany(
      { parentComment: id },
      { $set: { parentComment: null } },
    );

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