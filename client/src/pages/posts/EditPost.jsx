import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMyPosts, updatePost } from "../../services/postService";
import { getCategories } from "../../services/categoryService";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    tags: "",
    status: "draft",
    isFeatured: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getMyPosts(),
          getCategories(),
        ]);

        if (!postsData.success) {
          toast.error(postsData.message);
          return;
        }

        const post = postsData.posts.find((item) => item._id === id);

        if (!post) {
          toast.error("Post not found");
          navigate("/my-posts");
          return;
        }

        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          coverImage: post.coverImage || "",
          category: post.category?._id || post.category || "",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
          status: post.status || "draft",
          isFeatured: post.isFeatured || false,
        });

        if (categoriesData.success) {
          setCategories(categoriesData.categories);
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

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const data = await updatePost(id, payload);

      if (data.success) {
        toast.success(data.message);
        navigate("/my-posts");
      } else {
        toast.error(data.message || "Failed to update post");
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/my-posts"
          className="mb-4 inline-flex text-sm font-medium text-indigo-600 hover:underline"
        >
          Back to My Posts
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Edit Post</h1>

          <p className="mt-2 text-slate-600">Update your blog post.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label className="mb-2 block font-medium">Title</label>

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Slug</label>

            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Excerpt</label>

            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Content</label>

            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={12}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Cover Image URL</label>

            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Tags</label>

            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              placeholder="react, javascript"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />

            <span>Feature this post</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Updating Post..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
