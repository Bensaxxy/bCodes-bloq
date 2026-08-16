import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createCategory,
  updateCategory,
} from "../../services/categoryService";

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(category);

  // Populate form when editing
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setSlug(category.slug || "");
      setDescription(category.description || "");
    } else {
      setName("");
      setSlug("");
      setDescription("");
    }
  }, [category]);

  // Generate slug from category name
  const handleNameChange = (e) => {
    const value = e.target.value;

    setName(value);

    // Only automatically generate slug when creating
    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      setSlug(generatedSlug);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!slug.trim()) {
      toast.error("Category slug is required");
      return;
    }

    try {
      setLoading(true);

      const categoryData = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
      };

      let data;

      if (isEditing) {
        data = await updateCategory(category._id, categoryData);
      } else {
        data = await createCategory(categoryData);
      }

      if (data.success) {
        toast.success(
          data.message ||
            (isEditing
              ? "Category updated successfully"
              : "Category created successfully"),
        );

        onSuccess(data.category);
      } else {
        toast.error(data.message || "Something went wrong");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Category Name */}
      <div>
        <label
          htmlFor="category-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Category Name <span className="text-red-500">*</span>
        </label>

        <input
          id="category-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Technology"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="category-slug"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Slug <span className="text-red-500">*</span>
        </label>

        <input
          id="category-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. technology"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          required
        />

        <p className="mt-1 text-xs text-slate-500">
          Used in the category URL.
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="category-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="category-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Technology, software development and programming."
          rows={4}
          className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex min-w-32 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;