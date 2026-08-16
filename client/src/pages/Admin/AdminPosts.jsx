import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminPosts,
  deleteAdminPost,
  updateAdminPostStatus,
  updateAdminPostFeatured,
} from "../../services/adminService";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const data = await getAdminPosts(page, limit);

      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch posts");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleStatus = async (post) => {
    const newStatus =
      post.status === "published" ? "draft" : "published";

    try {
      setActionLoading(true);

      const data = await updateAdminPostStatus(post._id, newStatus);

      if (data.success) {
        toast.success(data.message || "Post status updated");
        fetchPosts();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeatured = async (post) => {
    try {
      setActionLoading(true);

      const data = await updateAdminPostFeatured(
        post._id,
        !post.isFeatured,
      );

      if (data.success) {
        toast.success(data.message || "Featured status updated");
        fetchPosts();
      } else {
        toast.error(data.message || "Failed to update featured status");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update featured status",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await deleteAdminPost(id);

      if (data.success) {
        toast.success(data.message || "Post deleted successfully");
        fetchPosts();
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete post",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Posts
        </h1>

        <p className="mt-2 text-slate-600">
          Manage, publish and feature blog posts.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No posts found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Post
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Author
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Featured
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50">
                    <td className="max-w-xs px-6 py-5">
                      <p className="truncate font-semibold text-slate-900">
                        {post.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {post.category?.name || "No category"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {post.author?.name || "Unknown"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          post.isFeatured
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {post.isFeatured ? "Featured" : "Normal"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatus(post)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                        >
                          {post.status === "published"
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                        <button
                          disabled={actionLoading}
                          onClick={() => handleFeatured(post)}
                          className="rounded-lg bg-purple-50 px-3 py-2 text-xs font-medium text-purple-600 hover:bg-purple-100"
                        >
                          {post.isFeatured ? "Unfeature" : "Feature"}
                        </button>

                        <button
                          disabled={actionLoading}
                          onClick={() => handleDelete(post._id)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;