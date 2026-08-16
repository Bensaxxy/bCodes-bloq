import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Post title
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },

    // URL-friendly version of the title
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Short description of the post
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // Main blog content
    content: {
      type: String,
      required: true,
    },

    // Blog cover image
    coverImage: {
      type: String,
      default: "",
    },

    // Author of the post
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Category of the post
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Post tags
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // Draft or published
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    // Featured post
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Number of times the post has been viewed
    views: {
      type: Number,
      default: 0,
    },

    // Number of likes
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    // Date the post was published
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

// Search-related index
postSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
  tags: "text",
});

// Useful for filtering published posts and sorting by date
postSchema.index({
  status: 1,
  createdAt: -1,
});

// Useful when filtering posts by category
postSchema.index({
  category: 1,
  createdAt: -1,
});

// Useful when getting posts belonging to an author
postSchema.index({
  author: 1,
  createdAt: -1,
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;
