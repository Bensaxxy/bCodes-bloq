import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminComments,
  deleteAdminComment,
} from "../../services/adminService";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const data = await getAdminComments(page, limit);

      if (data.success) {
        setComments(data.comments || []);
        setPagination(data.pagination);
      } else {
        toast.error(data.message || "Failed to fetch comments");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch comments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await deleteAdminComment(id);

      if (data.success) {
        toast.success(data.message || "Comment deleted successfully");

        fetchComments();
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete comment",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Comments
        </h1>

        <p className="mt-2 text-slate-600">
          Review and manage comments from your users.
        </p>
      </div>

      {/* Comments */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        ) : comments.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No comments found.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-6 transition hover:bg-slate-50"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* Author */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-900">
                        {comment.author?.name || "Unknown user"}
                      </span>

                      <span className="text-sm text-slate-400">
                        {comment.author?.email || ""}
                      </span>
                    </div>

                    {/* Post */}
                    <div className="mt-2 text-sm text-indigo-600">
                      On:{" "}
                      <span className="font-medium">
                        {comment.post?.title || "Unknown post"}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-4 rounded-lg bg-slate-100 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {comment.content}
                      </p>
                    </div>

                    {/* Date */}
                    <p className="mt-3 text-xs text-slate-400">
                      {comment.createdAt
                        ? new Date(
                            comment.createdAt,
                          ).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleDelete(comment._id)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComments;