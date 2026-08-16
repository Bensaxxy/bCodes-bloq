import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../services/commentService";
import UserAvatar from "../UserAvatar";
import UserName from "../UserName";

const MAX_LENGTH = 1000;

const CommentItem = ({
  comment,
  comments,
  postId,
  user,
  setComments,
  onUpdated,
  onDeleted,
  depth = 0,
}) => {
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  // Find replies belonging to this comment
  const replies = comments.filter((item) => {
    if (!item.parentComment) return false;

    const parentId =
      typeof item.parentComment === "object"
        ? item.parentComment._id
        : item.parentComment;

    return parentId?.toString() === comment._id.toString();
  });

  const isOwner =
    user &&
    (comment.author?._id || comment.user?._id)?.toString() ===
      user._id?.toString();

  // -----------------------------
  // CREATE REPLY
  // -----------------------------

  const handleReply = async (e) => {
    e.preventDefault();

    const trimmedContent = replyContent.trim();

    if (!trimmedContent) {
      toast.error("Please enter a reply");
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      toast.error(`Reply cannot exceed ${MAX_LENGTH} characters`);
      return;
    }

    try {
      setSubmitting(true);

      const data = await createComment(postId, {
        content: trimmedContent,
        parentComment: comment._id,
      });

      if (data.success) {
        toast.success(data.message || "Reply added successfully");

        setComments((prev) => [...prev, data.comment]);

        setReplyContent("");
        setReplying(false);
      } else {
        toast.error(data.message || "Failed to add reply");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // UPDATE
  // -----------------------------

  const handleUpdate = async () => {
    const trimmedContent = editContent.trim();

    if (!trimmedContent) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const data = await updateComment(comment._id, {
        content: trimmedContent,
      });

      if (data.success) {
        toast.success(data.message || "Comment updated");

        setComments((prev) =>
          prev.map((item) =>
            item._id === data.comment._id ? data.comment : item,
          ),
        );

        setEditing(false);
        setEditContent(data.comment.content);
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

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      const data = await deleteComment(comment._id);

      if (data.success) {
        toast.success(data.message || "Comment deleted");

        onDeleted(comment._id);

        // Remove all descendants too
        setComments((prev) =>
          prev.filter((item) => {
            const parentId =
              typeof item.parentComment === "object"
                ? item.parentComment?._id
                : item.parentComment;

            return (
              item._id !== comment._id &&
              parentId?.toString() !== comment._id.toString()
            );
          }),
        );
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
    <div className={depth > 0 ? "ml-6 sm:ml-10" : ""}>
      {/* Comment */}
      <div className="relative">
        {depth > 0 && (
          <div className="absolute -left-5 top-0 h-full w-px bg-slate-200" />
        )}

        <div className="rounded-xl border border-slate-200 bg-gray-100 p-5">
          {/* Author */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                <UserAvatar user={user} />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  <UserName user={user}/>
                </p>

                <p className="text-xs text-slate-400">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {editing ? (
            <div className="mt-4">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                maxLength={MAX_LENGTH}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {comment.content}
            </p>
          )}

          {/* Actions */}
          {!editing && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              {user && (
                <button
                  onClick={() => setReplying((prev) => !prev)}
                  className="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {replying ? "Cancel" : "Reply"}
                </button>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="font-medium text-slate-600 hover:text-slate-900"
                  >
                    Edit
                  </button>

                  <button
                    onClick={handleDelete}
                    className="font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}

              {replies.length > 0 && (
                <span className="text-xs text-slate-400">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
          )}

          {/* Reply Form */}
          {replying && user && (
            <form onSubmit={handleReply} className="mt-5">
              <textarea
                value={replyContent}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_LENGTH) {
                    setReplyContent(e.target.value);
                  }
                }}
                placeholder={`Reply to ${
                  comment.author?.name || comment.user?.name || "this comment"
                }...`}
                rows={3}
                disabled={submitting}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {MAX_LENGTH - replyContent.length} characters remaining
                </span>

                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Replying..." : "Post Reply"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              comments={comments}
              postId={postId}
              user={user}
              setComments={setComments}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
