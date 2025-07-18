import { Category } from '../model/Category.js';
import { Transaction } from '../model/Transection.js';
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
    
    // Find the categories for the user
    const categories = await Category.find({ userId }).select('-__v -userId');

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

  const { name, type } = req.body;

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
    const userId = req.user._id.toString();

    const regex = new RegExp(`^${name.trim()}$`, 'i')

    // Check if the category already exists for the user with case-insensitive match
    const categoryExists = await Category.exists({
      userId,
      name: { $regex: regex},
      type
    });

    if (categoryExists) {
      return errorResponse(res, 400, `Category already exists for "${type}"`);
    }

    // Create the new category
    await Category.create({
      userId,
      name: name.trim(),
      type
    });

    return successResponse(res, {
      message: 'Category created successfully',
    }, 201);
  } catch (error) {
    console.error("Create Category Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, type } = req.body;

  if (!categoryId) {
    return errorResponse(res, 400, 'Category ID is required');
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    // check if the category name already exists for the user
    if (name) {
      const regex = new RegExp(`^${name.trim()}$`, 'i');
      const categoryExists = await Category.exists({
        _id: { $ne: categoryId },
        userId,
        name: { $regex: regex },
        type 
      });
      if (categoryExists) {
        return errorResponse(res, 400, `Category already exists for "${type}"`);
      }
    }

    // update the category
    const updated = await Category.findOneAndUpdate(
      { _id: categoryId, userId },
      { $set: { name: name.trim(), type} },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return errorResponse(res, 404, 'Category not found or does not belong to user');
    }

    return successResponse(res, {
      message: 'Category updated successfully',
      category: updated
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};


// Delete a category
export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  const forceDelete = req.query.force === "true";

  try {
    const category = await Category.findById(categoryId);
    if (!category) return errorResponse(res, 404, "Category not found");

    const transactionCount = await Transaction.countDocuments({ categoryId });

    // Warn if category is in use and not forcing delete
    if (transactionCount && !forceDelete) {
      return successResponse(res, {
        warn: true,
        message: `This category is used in ${transactionCount} transaction(s).`,
        count: transactionCount,
      });
    }

    // Delete transactions if forceDelete is true
    if (forceDelete && transactionCount) {
      await Transaction.deleteMany({ categoryId });
    }

    await category.deleteOne();

    return successResponse(res, {
      message: `Category deleted${transactionCount ? " along with related transactions" : ""}.`,
      deletedTransactions: transactionCount,
    });
  } catch (err) {
    console.error("Delete Category Error:", err);
    return errorResponse(res, 500, "Failed to delete category");
  }
};
