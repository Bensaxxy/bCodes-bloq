import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCommentsByPost } from "../../services/commentService";
import { AppContent } from "../../context/AppContaxt";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import UserAvatar from "../UserAvatar";
import UserName from "../UserName";

const CommentSection = ({ postId }) => {
  const { user } = useContext(AppContent);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);

      const data = await getCommentsByPost(postId);

      if (data.success) {
        setComments(data.comments || []);
      } else {
        toast.error(data.message || "Failed to fetch comments");
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
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  // Add new comment or reply
  const handleCreated = (comment) => {
    setComments((prev) => [...prev, comment]);
  };

  // Update comment/reply
  const handleUpdated = (updatedComment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === updatedComment._id ? updatedComment : comment,
      ),
    );
  };

  // Delete comment/reply
  const handleDeleted = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };

  // Only top-level comments
  const topLevelComments = comments.filter((comment) => !comment.parentComment);

  return (
    <section className="mt-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Join the conversation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Share your thoughts and engage with the community.
              </p>
            </div>

            <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-indigo-50 px-3 text-sm font-semibold text-indigo-600">
              {comments.length}
            </div>
          </div>
        </div>

        {/* Create Comment */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-6 py-6 sm:px-8">
          {user ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {/* {user.name?.charAt(0).toUpperCase() || "U"} */}
                  <UserAvatar user={user}/>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {/* {user.name} */}
                    <UserName user={user}/>
                  </p>

                  <p className="text-xs text-slate-500">Leave a comment</p>
                </div>
              </div>

              <CommentForm postId={postId} onCreated={handleCreated} />
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-gray-200 p-5 text-center">
              <p className="font-medium text-slate-800">
                Want to join the conversation?
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sign in to leave a comment on this article.
              </p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="px-6 sm:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

              <p className="mt-4 text-sm text-slate-500">Loading comments...</p>
            </div>
          ) : topLevelComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-7 w-7 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0H8.25m7.125 0a.75.75 0 100-1.5.75 0 000 1.5zm0 0H15m-9.75 3.75h9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No comments yet
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Be the first person to share your thoughts about this article.
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  comments={comments}
                  postId={postId}
                  user={user}
                  setComments={setComments}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
