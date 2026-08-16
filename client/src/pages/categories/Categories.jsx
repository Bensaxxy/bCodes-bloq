import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCategories } from "../../services/categoryService";
import CategoryCard from "../../components/Categories/CategoryCard";
import Modal from "../../components/shared/Modal";
import CategoryForm from "../../components/Categories/CategoryForm";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Category being edited
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      if (data.success) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || "Failed to fetch categories");
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
    fetchCategories();
  }, []);

  // After creating a category
  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [newCategory, ...prev]);
    setShowModal(false);
  };

  // After updating a category
  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category,
      ),
    );

    setShowEditModal(false);
    setSelectedCategory(null);
  };

  // Open edit modal
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {/* <span>←</span> */}
            Back
          </button>
        </div>
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Categories
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Explore our articles by category and discover content that interests
            you.
          </p>

          {/* Create Category Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 rounded-full bg-indigo-600 px-6 py-2.5 font-medium text-white transition hover:bg-indigo-700"
          >
            Create Category
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          </div>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-slate-900">
              No categories found
            </h2>

            <p className="mt-2 text-slate-600">
              There are currently no categories available.
            </p>
          </div>
        )}

        {/* Categories */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onEdit={() => handleEditCategory(category)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Category"
        description="Create a new blog category."
      >
        <CategoryForm
          onClose={() => setShowModal(false)}
          onSuccess={handleCategoryCreated}
        />
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        title="Edit Category"
        description="Update your category information."
      >
        <CategoryForm
          category={selectedCategory}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCategory(null);
          }}
          onSuccess={handleCategoryUpdated}
        />
      </Modal>
    </div>
  );
};

export default Categories;
