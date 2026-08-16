import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPostBySlug } from "../../services/postService";
import CommentSection from "../../components/Comments/CommentSection";
import { AppContent } from "../../context/AppContaxt";
import LikeButton from "../../components/Posts/LikeButton";
import UserName from "../../components/UserName";

const PostDetails = () => {
  const navigate = useNavigate();

  const { slug } = useParams();
  const { user } = useContext(AppContent);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      setLoading(true);

      const data = await getPostBySlug(slug);

      if (data.success) {
        setPost(data.post);
      } else {
        toast.error(data.message || "Post not found");
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
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Post not found</h1>

          <Link
            to="/posts"
            className="mt-4 inline-block text-indigo-600 hover:underline"
          >
            Back to posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gray-200 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {/* <span>←</span> */}
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(380px,1fr)]">
          {/* =========================
              LEFT - POST
          ========================== */}
          <main className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gray-200 shadow-sm">
              <div className="p-5 sm:p-7 lg:p-8">
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
                <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>

                {/* Meta */}
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>
                    By <UserName user={post.author} className="text-gray-800" />
                  </span>

                  <span>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : ""}
                  </span>

                  <span>{post.views || 0} views</span>
                </div>

                {/* Like */}
                <div className="mt-6">
                  <LikeButton postId={post._id} user={user} />
                </div>
              </div>

              {/* Cover Image */}
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="max-h-162.5 w-full object-cover"
                />
              )}

              {/* Content */}
              <div className="p-5 sm:p-7 lg:p-8">
                <p className="mb-8 text-lg leading-8 text-slate-600">
                  {post.excerpt}
                </p>

                <div className="whitespace-pre-wrap text-base leading-8 text-slate-800">
                  {post.content}
                </div>
              </div>
            </div>
          </main>

          {/* =========================
              RIGHT - COMMENTS
          ========================== */}
          <aside className="min-w-0 lg:sticky lg:top-0 lg:self-start">
            <CommentSection postId={post._id} />
          </aside>
        </div>
      </div>
    </article>
  );
};

export default PostDetails;
