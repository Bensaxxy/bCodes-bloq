import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategoryBySlug } from "../../services/categoryService";

const CategoryDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    try {
      setLoading(true);

      const data = await getCategoryBySlug(slug);

      if (data.success) {
        setCategory(data.category);
      } else {
        toast.error(data.message || "Category not found");
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
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Category not found
          </h1>

          <button
            onClick={() => navigate("/categories")}
            className="mt-5 rounded-full bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {/* <span>←</span> */}
            Back
          </button>
        </div>

        {/* Category Header */}
        <div className="mb-10 rounded-2xl bg-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-4 max-w-3xl text-slate-600">
              {category.description}
            </p>
          )}
        </div>

        {/* Posts */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Posts in {category.name}
          </h2>

          {!category.posts || category.posts.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow">
              <p className="text-slate-600">
                No posts available in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.posts.map((post) => (
                <article
                  key={post._id}
                  onClick={() => navigate(`/posts/${post.slug}`)}
                  className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-5 text-sm font-medium text-indigo-600">
                      Read article →
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
