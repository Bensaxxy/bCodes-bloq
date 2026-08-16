import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  restoreAdminCategory,
} from "../../services/adminService";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getAdminCategories();

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setActionLoading(true);

      let data;

      if (editingCategory) {
        data = await updateAdminCategory(
          editingCategory._id,
          form,
        );
      } else {
        data = await createAdminCategory(form);
      }

      if (data.success) {
        toast.success(
          data.message ||
            (editingCategory
              ? "Category updated successfully"
              : "Category created successfully"),
        );

        setShowModal(false);
        setForm(emptyForm);
        setEditingCategory(null);

        fetchCategories();
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Operation failed",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category?",
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      const data = await deleteAdminCategory(id);

      if (data.success) {
        toast.success(data.message || "Category deleted");

        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setActionLoading(true);

      const data = await restoreAdminCategory(id);

      if (data.success) {
        toast.success(data.message || "Category restored");

        fetchCategories();
      } else {
        toast.error(data.message || "Failed to restore category");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to restore category",
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Categories
          </h1>

          <p className="mt-2 text-slate-600">
            Create and manage post categories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Create Category
        </button>
      </div>

      {/* Categories */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            No categories found
          </h2>

          <p className="mt-2 text-slate-500">
            Create your first category.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {category.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    /{category.slug}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    category.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {category.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {category.description}
                </p>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                >
                  Edit
                </button>

                {category.isActive ? (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleDelete(category._id)}
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleRestore(category._id)}
                    className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100"
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory
                  ? "Edit Category"
                  : "Create Category"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Image URL
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700"
              >
                Cancel
              </button>

              <button
                disabled={actionLoading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {actionLoading
                  ? "Saving..."
                  : editingCategory
                    ? "Update Category"
                    : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;