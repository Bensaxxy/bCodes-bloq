import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // The post this comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    // The user who wrote the comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Comment content
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const commentModel =
  mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;
