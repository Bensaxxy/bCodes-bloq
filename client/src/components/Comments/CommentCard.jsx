import React, { useState } from "react";
import { toast } from "react-toastify";
import { deleteComment, updateComment } from "../../services/commentService";

const CommentCard = ({ comment, user, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const isOwner =
    user && comment.author?._id === user._id;

  const handleUpdate = async () => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const data = await updateComment(comment._id, {
        content: content.trim(),
      });

      if (data.success) {
        toast.success(data.message);
        setEditing(false);
        onUpdated(data.comment);
      } else {
        toast.error(data.message || "Failed to update comment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      const data = await deleteComment(comment._id);

      if (data.success) {
        toast.success(data.message);
        onDeleted(comment._id);
      } else {
        toast.error(data.message || "Failed to delete comment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="border-b border-slate-200 py-5 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
          {comment.author?.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1">
          {/* Author */}
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-slate-900">
              {comment.author?.name || "Unknown user"}
            </h4>

            <span className="text-xs text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content */}
          {editing ? (
            <div className="mt-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />

              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setContent(comment.content);
                  }}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-slate-600">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!editing && isOwner && (
            <div className="mt-3 flex gap-4 text-sm">
              <button
                onClick={() => setEditing(true)}
                className="font-medium text-indigo-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="font-medium text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;