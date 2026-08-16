import React, { useState } from "react";
import { toast } from "react-toastify";
import { createComment } from "../../services/commentService";

const MAX_LENGTH = 1000;

const CommentForm = ({ postId, onCreated }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      toast.error("Please write a comment");
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      toast.error(`Comment cannot exceed ${MAX_LENGTH} characters`);
      return;
    }

    try {
      setLoading(true);

      const data = await createComment(postId, {
        content: trimmedContent,
      });

      if (data.success) {
        toast.success(data.message || "Comment posted successfully");
        setContent("");
        onCreated(data.comment);
      } else {
        toast.error(data.message || "Failed to add comment");
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

  const remainingCharacters = MAX_LENGTH - content.length;

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50">
        <textarea
          value={content}
          onChange={(e) => {
            if (e.target.value.length <= MAX_LENGTH) {
              setContent(e.target.value);
            }
          }}
          rows={5}
          placeholder="What are your thoughts on this article?"
          className="w-full resize-none border-0 bg-transparent px-4 py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-3">
          <span
            className={`text-xs ${
              remainingCharacters < 100
                ? "text-red-500"
                : "text-slate-400"
            }`}
          >
            {remainingCharacters} characters remaining
          </span>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Posting...
              </>
            ) : (
              <>
                Post Comment

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12h12m0 0l-4-4m4 4l-4 4"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;