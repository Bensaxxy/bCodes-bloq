import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getLikeStatus,
  likePost,
  unlikePost,
} from "../../services/postService";

const LikeButton = ({ postId, user }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Get current user's like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      // Don't check if user isn't logged in
      if (!user || !postId) {
        setCheckingStatus(false);
        return;
      }

      try {
        setCheckingStatus(true);

        const data = await getLikeStatus(postId);

        if (data.success) {
          setLiked(data.liked);
          setLikes(data.likes);
        }
      } catch (error) {
        // Don't show an error toast here.
        // The user simply might not be authenticated.
        console.error("Get like status error:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkLikeStatus();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      toast.info("Please sign in to like this post");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      if (liked) {
        // UNLIKE
        const data = await unlikePost(postId);

        if (data.success) {
          setLiked(false);
          setLikes(data.likes);
        } else {
          toast.error(data.message || "Failed to unlike post");
        }
      } else {
        // LIKE
        const data = await likePost(postId);

        if (data.success) {
          setLiked(true);
          setLikes(data.likes);
        } else {
          toast.error(data.message || "Failed to like post");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading || checkingStatus}
      aria-label={liked ? "Unlike post" : "Like post"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        liked
          ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      } ${
        loading || checkingStatus
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer"
      }`}
    >
      {liked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1.5 4 2.5C10.5 6.5 12 5 14 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
          />
        </svg>
      )}

      <span>
        {loading
          ? "..."
          : liked
            ? "Liked"
            : "Like"}
      </span>

      <span className="border-l border-current/20 pl-2">
        {likes}
      </span>
    </button>
  );
};

export default LikeButton;