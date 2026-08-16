import React from "react";
import { Link } from "react-router-dom";
import UserName from "../UserName";

const PostCard = ({ post, user }) => {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Cover Image */}
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 items-center justify-center bg-slate-200 text-slate-500">
          No Image
        </div>
      )}

      <div className="p-5">
        {/* Category */}
        {post.category && (
          <Link
            to={`/categories/${post.category.slug}`}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h2 className="mt-2 line-clamp-2 text-xl font-bold text-slate-900">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {post.excerpt}
        </p>

        {/* Author / Date */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          {/* <Link to={`/users/${post.author._id}`}>{post.author.name}</Link> */}
          <UserName user={post.author} className="text-gray-800" />

          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span>{post.views || 0} views</span>

          <span>{post.likedBy?.length || 0} likes</span>
        </div>

        {/* Read More */}
        <Link
          to={`/posts/${post.slug}`}
          className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
