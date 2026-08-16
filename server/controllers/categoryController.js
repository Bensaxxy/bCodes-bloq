import categoryModel from "../models/categoryModel.js";
import postModel from "../models/postModel.js";

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Category name and slug are required",
      });
    }

    const existingCategory = await categoryModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await categoryModel.create({
      name,
      slug,
      description: description || "",
      image: image || "",
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel
      .find({ isActive: true })
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const posts = await postModel
      .find({
        category: category._id,
        status: "published",
      })
      .populate("author", "name email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      category: {
        ...category.toObject(),
        posts,
      },
    });
  } catch (error) {
    console.error("Get category by slug error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Server Error",
    });
  }
};


// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, isActive } = req.body;

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};


// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await categoryModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};