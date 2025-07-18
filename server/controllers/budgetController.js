import { Budget } from "../model/Budget.js";
import { Category } from "../model/Category.js";
import { Transaction } from "../model/Transection.js";
import { successResponse, errorResponse } from "../utils/responseUtils.js";

// Get all budgets for a user
export const getBudgets = async (req, res) => {
  const { active } = req.query;

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();
    let query = { userId };

    // Filter for active budgets only
    if (active === "true") {
      const now = new Date();
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }

    const budgets = await Budget.find(query)
      .populate("categoryId", "name type icon")
      .sort({ startDate: -1 });

    // Calculate spending for each budget
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const spending = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              categoryId: budget.categoryId._id,
              date: {
                $gte: budget.startDate,
                $lte: budget.endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        const totalSpent = spending[0]?.totalSpent || 0;
        const remaining = budget.amount - totalSpent;
        const percentageUsed =
          budget.amount > 0
            ? ((totalSpent / budget.amount) * 100).toFixed(2)
            : 0;

        return {
          ...budget.toObject(),
          spending: {
            totalSpent,
            remaining,
            percentageUsed: parseFloat(percentageUsed),
            isOverBudget: totalSpent > budget.amount,
          },
        };
      })
    );

    return successResponse(res, {
      message: "Budgets retrieved successfully",
      budgets: budgetsWithSpending,
    });
  } catch (error) {
    console.error("Get Budgets Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Create a new budget
export const createBudget = async (req, res) => {
  const { categoryId, amount, startDate, endDate } = req.body;

  if (!categoryId || !amount || !startDate || !endDate) {
    return errorResponse(
      res,
      400,
      "All fields are required: categoryId, amount, startDate, endDate"
    );
  }

  if (amount <= 0) {
    return errorResponse(res, 400, "Amount must be greater than 0");
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return errorResponse(res, 400, "End date must be after start date");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    // Verify that the category exists and belongs to the user
    const category = await Category.findOne({ _id: categoryId, userId });
    if (!category) {
      return errorResponse(
        res,
        404,
        "Category not found or does not belong to user"
      );
    }

    // Check for overlapping budgets for the same category
    const overlappingBudget = await Budget.findOne({
      userId,
      categoryId,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (overlappingBudget) {
      return errorResponse(
        res,
        400,
        "A budget for this category already exists"
      );
    }

    const budget = new Budget({
      userId,
      categoryId,
      amount: parseFloat(amount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await budget.save();
    await budget.populate("categoryId", "name type");

    return successResponse(
      res,
      {
        message: "Budget created successfully",
        budget,
      },
      201
    );
  } catch (error) {
    console.error("Create Budget Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  const { budgetId } = req.params;
  const { categoryId, amount, startDate, endDate } = req.body;

  if (!budgetId) {
    return errorResponse(res, 400, "Budget ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify budget belongs to user
    const existingBudget = await Budget.findOne({ _id: budgetId, userId });
    if (!existingBudget) {
      return errorResponse(
        res,
        404,
        "Budget not found or does not belong to user"
      );
    }

    const updateFields = {};
    if (categoryId) updateFields.categoryId = categoryId;
    if (amount && amount > 0) updateFields.amount = parseFloat(amount);
    if (startDate) updateFields.startDate = new Date(startDate);
    if (endDate) updateFields.endDate = new Date(endDate);

    // Validate date range if both dates are provided
    if (updateFields.startDate && updateFields.endDate) {
      if (updateFields.endDate <= updateFields.startDate) {
        return errorResponse(res, 400, "End date must be after start date");
      }
    }

    // If updating category, verify it exists and belongs to user
    if (categoryId) {
      const category = await Category.findOne({
        _id: categoryId,
        userId,
      });
      if (!category) {
        return errorResponse(
          res,
          404,
          "Category not found or does not belong to user"
        );
      }
    }

    const budget = await Budget.findByIdAndUpdate(budgetId, updateFields, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name type icon");

    return successResponse(res, {
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update Budget Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  const { budgetId } = req.params;

  if (!budgetId) {
    return errorResponse(res, 400, "Budget ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify budget belongs to user before deleting
    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      userId,
    });

    if (!budget) {
      return errorResponse(
        res,
        404,
        "Budget not found or does not belong to user"
      );
    }

    return successResponse(res, {
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Get budget overview for a user
export const getBudgetOverview = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    const now = new Date();
    const activeBudgets = await Budget.find({
      userId,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("categoryId", "name type icon");

    let totalBudgeted = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;

    const budgetSummary = await Promise.all(
      activeBudgets.map(async (budget) => {
        const spending = await Transaction.aggregate([
          {
            $match: {
              userId: budget.userId,
              categoryId: budget.categoryId._id,
              date: {
                $gte: budget.startDate,
                $lte: budget.endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        const spent = spending[0]?.totalSpent || 0;
        totalBudgeted += budget.amount;
        totalSpent += spent;

        if (spent > budget.amount) {
          overBudgetCount++;
        }

        return {
          budgetId: budget._id,
          category: budget.categoryId,
          budgeted: budget.amount,
          spent,
          remaining: budget.amount - spent,
          percentageUsed:
            budget.amount > 0 ? ((spent / budget.amount) * 100).toFixed(2) : 0,
        };
      })
    );

    const overviewData = {
      message: "Budget overview retrieved successfully",
      summary: {
        totalBudgeted,
        totalSpent,
        totalRemaining: totalBudgeted - totalSpent,
        overallPercentageUsed:
          totalBudgeted > 0
            ? ((totalSpent / totalBudgeted) * 100).toFixed(2)
            : 0,
        activeBudgetsCount: activeBudgets.length,
        overBudgetCount,
      },
      budgets: budgetSummary,
    };

    return successResponse(res, overviewData);
  } catch (error) {
    console.error("Get Budget Overview Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Get spent amount for all budgets
export const getSpentAmount = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    const budgets = await Budget.find({ userId });

    const summaries = await Promise.all(
      budgets.map(async (budget) => {
        const matchQuery = {
          userId: budget.userId,
          type: "expense",
          date: {
            $gte: budget.startDate,
            $lte: budget.endDate,
          },
        };

        if (budget.categoryId) {
          matchQuery.categoryId = budget.categoryId;
        }

        const result = await Transaction.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: null,
              totalSpent: { $sum: "$amount" },
            },
          },
        ]);

        return {
          categoryId: budget.categoryId || null,
          spent: result[0]?.totalSpent || 0,
        };
      })
    );

    return successResponse(res, {
      message: 'Spent amounts retrieved successfully',
      summaries,
    });
  } catch (error) {
    console.error("Get Spent Amount Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
