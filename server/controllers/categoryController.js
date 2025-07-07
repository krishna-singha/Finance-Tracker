import { Category } from '../model/Category.js';
import {
  successResponse,
  errorResponse,
} from "../utils/responseUtils.js";

// Get all categories for a user
export const getCategories = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();
    
    const categories = await Category.find({ userId }).sort({ name: 1 });
    
    return successResponse(res, {
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  const { name, type, icon } = req.body;

  if (!name || !type) {
    return errorResponse(res, 400, 'Name and type are required');
  }

  if (!['income', 'expense'].includes(type)) {
    return errorResponse(res, 400, 'Type must be either "income" or "expense"');
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      userId, 
      name: name.trim(),
      type 
    });

    if (existingCategory) {
      return errorResponse(res, 400, 'Category with this name already exists for this type');
    }

    const category = new Category({
      userId,
      name: name.trim(),
      type,
      icon: icon || ''
    });

    await category.save();

    return successResponse(res, {
      message: 'Category created successfully',
      category
    }, 201);
  } catch (error) {
    console.error("Create Category Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, type, icon } = req.body;

  if (!categoryId) {
    return errorResponse(res, 400, 'Category ID is required');
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify category belongs to user
    const existingCategory = await Category.findOne({ _id: categoryId, userId });
    if (!existingCategory) {
      return errorResponse(res, 404, 'Category not found or does not belong to user');
    }

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (type && ['income', 'expense'].includes(type)) updateFields.type = type;
    if (icon !== undefined) updateFields.icon = icon;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      updateFields,
      { new: true, runValidators: true }
    );

    return successResponse(res, {
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    return errorResponse(res, 400, 'Category ID is required');
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify category belongs to user before deleting
    const category = await Category.findOneAndDelete({ 
      _id: categoryId, 
      userId 
    });

    if (!category) {
      return errorResponse(res, 404, 'Category not found or does not belong to user');
    }

    return successResponse(res, {
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


