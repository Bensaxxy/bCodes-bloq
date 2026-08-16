import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { getMyPosts, deletePost } from "../../services/postService";

const MyPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);

      const data = await getMyPosts();

      if (data.success) {
        setPosts(data.posts);
      } else {
        toast.error(data.message || "Failed to fetch your posts");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) return;

    try {
      const data = await deletePost(id);

      if (data.success) {
        toast.success(data.message);
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {/* <span>←</span> */}
            Back
          </button>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Posts</h1>

            <p className="mt-2 text-slate-600">
              Manage the posts you have created.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/posts"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Posts
            </Link>

            <Link
              to="/posts/create"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Post
            </Link>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold">
              You haven't created any posts yet.
            </h2>

            <Link
              to="/posts/create"
              className="mt-4 inline-block text-indigo-600 hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {post.title}
                  </h2>

                  <div className="mt-2 flex gap-3 text-sm text-slate-500">
                    <span className="capitalize">{post.status}</span>

                    <span>{post.views || 0} views</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/posts/${post.slug}`}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    View
                  </Link>

                  <Link
                    to={`/posts/edit/${post._id}`}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
