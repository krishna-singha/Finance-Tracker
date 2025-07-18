import { Transaction } from "../model/Transection.js";
import { Category } from "../model/Category.js";
import { successResponse, errorResponse } from "../utils/responseUtils.js";

// Get all transactions for a user
export const getTransactions = async (req, res) => {
  const { type, startDate, endDate, limit = 50, page = 1 } = req.query;

  // Validate pagination parameters
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();
    let query = { userId };

    // filter transections by type
    if (type && ["income", "expense"].includes(type)) {
      query.type = type;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return errorResponse(res, 400, "Invalid start date format");
        }
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return errorResponse(res, 400, "Invalid end date format");
        }
        query.date.$lte = end;
      }
    }

    const skip = (pageNum - 1) * limitNum;

    const transactions = await Transaction.find(query)
      .select("-__v -userId -createdAt")
      .populate("categoryId", "name _id")
      .sort({ date: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    const totalCount = await Transaction.countDocuments(query);

    const responseData = {
      message: "Transactions retrieved successfully",
      transactions,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNext: skip + transactions.length < totalCount,
        hasPrev: pageNum > 1,
      },
    };

    return successResponse(res, responseData);
  } catch (error) {
    console.error("Get Transactions Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  const { categoryId, type, amount, note, date } = req.body;

  if (!categoryId || !type || !amount || !date) {
    return errorResponse(
      res,
      400,
      "Category, type, amount, and date are required"
    );
  }

  if (amount <= 0) {
    return errorResponse(res, 400, "Amount must be greater than 0");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    const created = await Transaction.create({
      userId,
      categoryId,
      type,
      amount: parseFloat(amount),
      note: note?.trim() || "",
      date: new Date(date),
    });

    const transaction = await Transaction.findById(created._id)
      .select("-__v -userId -createdAt")
      .populate("categoryId", "name _id");

    return successResponse(
      res,
      {
        message: "Transaction created successfully",
        transaction,
      },
      201
    );
  } catch (error) {
    console.error("Create Transaction Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { categoryId, amount, note, date } = req.body;

  if (!transactionId) {
    return errorResponse(res, 400, "Transaction ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    // Verify transaction belongs to user
    const existingTransaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });
    if (!existingTransaction) {
      return errorResponse(
        res,
        404,
        "Transaction not found or does not belong to user"
      );
    }

    const updateFields = {};
    if (categoryId) updateFields.categoryId = categoryId;
    if (amount && amount > 0) updateFields.amount = parseFloat(amount);
    if (note !== undefined) updateFields.note = note.trim();
    if (date) updateFields.date = new Date(date);

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

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      updateFields,
      { new: true, runValidators: true }
    )
      .select("-__v -userId -createdAt")
      .populate("categoryId", "name _id");

    return successResponse(res, {
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update Transaction Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;


  if (!transactionId) {
    return errorResponse(res, 400, "Transaction ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();

    // Verify transaction belongs to user before deleting
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId,
    });

    if (!transaction) {
      return errorResponse(
        res,
        404,
        "Transaction not found or does not belong to user"
      );
    }

    return successResponse(res, {
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Get transaction summary for a user
export const getTransactionSummary = async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Get income and expense categories
    const incomeCategories = await Category.find({
      userId,
      type: "income",
    }).select("_id");
    const expenseCategories = await Category.find({
      userId,
      type: "expense",
    }).select("_id");

    const incomeCategoryIds = incomeCategories.map((cat) => cat._id);
    const expenseCategoryIds = expenseCategories.map((cat) => cat._id);

    // Calculate totals
    const [incomeResult, expenseResult] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId: userId,
            categoryId: { $in: incomeCategoryIds },
            ...dateFilter,
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Transaction.aggregate([
        {
          $match: {
            userId: userId,
            categoryId: { $in: expenseCategoryIds },
            ...dateFilter,
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    return successResponse(res, {
      message: "Transaction summary retrieved successfully",
      summary: {
        totalIncome,
        totalExpense,
        balance,
        period: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      },
    });
  } catch (error) {
    console.error("Get Transaction Summary Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
