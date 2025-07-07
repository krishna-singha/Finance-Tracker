import { Goal } from "../model/Goal.js";
import { successResponse, errorResponse } from "../utils/responseUtils.js";

// Get all goals for a user
export const getGoals = async (req, res) => {
  const { status } = req.query;

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString();
    let query = { userId };

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    // Calculate progress and status for each goal
    const goalsWithProgress = goals.map((goal) => {
      const progress =
        goal.targetAmount > 0
          ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)
          : 0;
      const isCompleted = goal.currentAmount >= goal.targetAmount;
      const isOverdue =
        goal.deadline && new Date() > goal.deadline && !isCompleted;
      const daysToDeadline = goal.deadline
        ? Math.ceil((goal.deadline - new Date()) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...goal.toObject(),
        progress: {
          percentage: parseFloat(progress),
          remaining: Math.max(0, goal.targetAmount - goal.currentAmount),
          isCompleted,
          isOverdue,
          daysToDeadline,
        },
      };
    });

    // Filter by status if requested
    let filteredGoals = goalsWithProgress;
    if (status === "completed") {
      filteredGoals = goalsWithProgress.filter(
        (goal) => goal.progress.isCompleted
      );
    } else if (status === "active") {
      filteredGoals = goalsWithProgress.filter(
        (goal) => !goal.progress.isCompleted
      );
    } else if (status === "overdue") {
      filteredGoals = goalsWithProgress.filter(
        (goal) => goal.progress.isOverdue
      );
    }

    return successResponse(res, {
      message: "Goals retrieved successfully",
      goals: filteredGoals,
    });
  } catch (error) {
    console.error("Get Goals Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Create a new goal
export const createGoal = async (req, res) => {
  const { title, targetAmount, currentAmount, deadline } = req.body;

  if (!title || !targetAmount) {
    return errorResponse(res, 400, "Title and target amount are required");
  }

  if (targetAmount <= 0) {
    return errorResponse(res, 400, "Target amount must be greater than 0");
  }

  if (currentAmount && currentAmount < 0) {
    return errorResponse(res, 400, "Current amount cannot be negative");
  }

  if (deadline && new Date(deadline) <= new Date()) {
    return errorResponse(res, 400, "Deadline must be in the future");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    const goal = new Goal({
      userId,
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline ? new Date(deadline) : null,
    });

    await goal.save();

    return successResponse(
      res,
      {
        message: "Goal created successfully",
        goal,
      },
      201
    );
  } catch (error) {
    console.error("Create Goal Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  const { goalId } = req.params;
  const { title, targetAmount, currentAmount, deadline } = req.body;

  if (!goalId) {
    return errorResponse(res, 400, "Goal ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify goal belongs to user
    const existingGoal = await Goal.findOne({ _id: goalId, userId });
    if (!existingGoal) {
      return errorResponse(
        res,
        404,
        "Goal not found or does not belong to user"
      );
    }

    const updateFields = {};
    if (title) updateFields.title = title.trim();
    if (targetAmount && targetAmount > 0)
      updateFields.targetAmount = parseFloat(targetAmount);
    if (currentAmount !== undefined && currentAmount >= 0)
      updateFields.currentAmount = parseFloat(currentAmount);
    if (deadline !== undefined) {
      if (deadline && new Date(deadline) <= new Date()) {
        return errorResponse(res, 400, "Deadline must be in the future");
      }
      updateFields.deadline = deadline ? new Date(deadline) : null;
    }

    const goal = await Goal.findByIdAndUpdate(goalId, updateFields, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, {
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update Goal Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Update goal progress (add to current amount)
export const updateGoalProgress = async (req, res) => {
  const { goalId } = req.params;
  const { amount, action = "add" } = req.body;

  if (!goalId || amount === undefined) {
    return errorResponse(res, 400, "Goal ID and amount are required");
  }

  if (amount <= 0) {
    return errorResponse(res, 400, "Amount must be greater than 0");
  }

  if (!["add", "subtract"].includes(action)) {
    return errorResponse(res, 400, 'Action must be either "add" or "subtract"');
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify goal belongs to user
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return errorResponse(
        res,
        404,
        "Goal not found or does not belong to user"
      );
    }

    const amountToModify = parseFloat(amount);
    let newCurrentAmount;

    if (action === "add") {
      newCurrentAmount = goal.currentAmount + amountToModify;
    } else {
      newCurrentAmount = Math.max(0, goal.currentAmount - amountToModify);
    }

    goal.currentAmount = newCurrentAmount;
    await goal.save();

    // Calculate progress
    const progress =
      goal.targetAmount > 0
        ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)
        : 0;
    const isCompleted = goal.currentAmount >= goal.targetAmount;

    const responseData = {
      ...goal.toObject(),
      progress: {
        percentage: parseFloat(progress),
        remaining: Math.max(0, goal.targetAmount - goal.currentAmount),
        isCompleted,
      },
    };

    return successResponse(res, {
      message: "Goal progress updated successfully",
      goal: responseData,
    });
  } catch (error) {
    console.error("Update Goal Progress Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
// Delete a goal
export const deleteGoal = async (req, res) => {
  const { goalId } = req.params;

  if (!goalId) {
    return errorResponse(res, 400, "Goal ID is required");
  }

  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    // Verify goal belongs to user before deleting
    const goal = await Goal.findOneAndDelete({
      _id: goalId,
      userId,
    });

    if (!goal) {
      return errorResponse(
        res,
        404,
        "Goal not found or does not belong to user"
      );
    }

    return successResponse(res, {
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete Goal Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};

// Get goals summary for a user
export const getGoalsSummary = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, 401, "User not authenticated");
  }

  try {
    const userId = req.user._id.toString(); // Get user ID from JWT middleware

    const goals = await Goal.find({ userId });

    let totalTargetAmount = 0;
    let totalCurrentAmount = 0;
    let completedGoals = 0;
    let overdueGoals = 0;

    goals.forEach((goal) => {
      totalTargetAmount += goal.targetAmount;
      totalCurrentAmount += goal.currentAmount;

      if (goal.currentAmount >= goal.targetAmount) {
        completedGoals++;
      }

      if (
        goal.deadline &&
        new Date() > goal.deadline &&
        goal.currentAmount < goal.targetAmount
      ) {
        overdueGoals++;
      }
    });

    const overallProgress =
      totalTargetAmount > 0
        ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(2)
        : 0;

    const summaryData = {
      message: "Goals summary retrieved successfully",
      summary: {
        totalGoals: goals.length,
        completedGoals,
        activeGoals: goals.length - completedGoals,
        overdueGoals,
        totalTargetAmount,
        totalCurrentAmount,
        overallProgress: parseFloat(overallProgress),
        averageProgress:
          goals.length > 0
            ? parseFloat(
                (
                  goals.reduce(
                    (sum, goal) =>
                      sum +
                      (goal.targetAmount > 0
                        ? (goal.currentAmount / goal.targetAmount) * 100
                        : 0),
                    0
                  ) / goals.length
                ).toFixed(2)
              )
            : 0,
      },
    };

    return successResponse(res, summaryData);
  } catch (error) {
    console.error("Get Goals Summary Error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
