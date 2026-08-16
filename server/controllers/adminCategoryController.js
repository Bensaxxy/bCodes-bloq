import categoryModel from "../models/categoryModel.js";

// ==================================================
// GET ALL CATEGORIES
// ==================================================
export const getAllCategories = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const search = req.query.search?.trim() || "";
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;

    const filter = {};

    // Search by name, slug or description
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          slug: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by active/inactive status
    if (isActive !== undefined) {
      if (isActive !== "true" && isActive !== "false") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      filter.isActive = isActive === "true";
    }

    const [categories, totalCategories] = await Promise.all([
      categoryModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      categoryModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      categories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCategories / limit),
        totalCategories,
        limit,
      },
    });
  } catch (error) {
    console.error("Admin get all categories error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ==================================================
// GET SINGLE CATEGORY
// ==================================================
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Admin get category error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ==================================================
// CREATE CATEGORY
// ==================================================
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, isActive } = req.body;

    // Required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const cleanName = name.trim();
    const cleanSlug = slug.trim().toLowerCase();

    // Check duplicate name
    const existingName = await categoryModel.findOne({
      name: cleanName,
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    // Check duplicate slug
    const existingSlug = await categoryModel.findOne({
      slug: cleanSlug,
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: "A category with this slug already exists",
      });
    }

    // Validate isActive
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    const category = await categoryModel.create({
      name: cleanName,
      slug: cleanSlug,
      description: description?.trim() || "",
      image: image || "",
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Admin create category error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ==================================================
// UPDATE CATEGORY
// ==================================================
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

    // Validate isActive
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    // Check duplicate name
    if (name !== undefined && name.trim() !== category.name) {
      const existingName = await categoryModel.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (existingName) {
        return res.status(400).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    // Check duplicate slug
    if (slug !== undefined && slug.trim().toLowerCase() !== category.slug) {
      const existingSlug = await categoryModel.findOne({
        slug: slug.trim().toLowerCase(),
        _id: { $ne: id },
      });

      if (existingSlug) {
        return res.status(400).json({
          success: false,
          message: "A category with this slug already exists",
        });
      }
    }

    // Update fields
    if (name !== undefined) {
      category.name = name.trim();
    }

    if (slug !== undefined) {
      category.slug = slug.trim().toLowerCase();
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (image !== undefined) {
      category.image = image;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Admin update category error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ==================================================
// DELETE CATEGORY
// ==================================================
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

    // Category is already inactive
    if (!category.isActive) {
      return res.status(400).json({
        success: false,
        message: "Category is already inactive",
      });
    }

    // Soft delete
    category.isActive = false;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      category,
    });
  } catch (error) {
    console.error("Admin deactivate category error:", error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Server Error",
    });
  }
};

// ==================================================
// RESTORE CATEGORY
// ==================================================
export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.isActive) {
      return res.status(400).json({
        success: false,
        message: "Category is already active",
      });
    }

    category.isActive = true;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category restored successfully",
      category,
    });
  } catch (error) {
    console.error("Admin restore category error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Server Error",
    });
  }
};
