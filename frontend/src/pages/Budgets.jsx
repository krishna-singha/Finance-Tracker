import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";
import {
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { FaChartPie } from "react-icons/fa";
import axios from "axios";
import BudgetModal from "../modals/Budget.Modal";

const Budgets = () => {
  const { isAuthenticated } = useAuth();
  const { fetchBudgets, budgets } = useData();

  const [spent, setSpent] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSpentAmounts = async () => {
    try {
      const response = await axios.get(`/api/v1/budgets/spent`);
      setSpent(response.data.summaries || []);
    } catch (error) {
      console.error("Error fetching spent amounts:", error);
      toast.error("Failed to fetch spent amounts");
    }
  };

  const fetchAllBudgetData = async () => {
    await fetchBudgets();
    await fetchSpentAmounts();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllBudgetData();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      await axios.delete(`/api/v1/budgets/${id}`);
      toast.success("Budget deleted!");
      await fetchAllBudgetData();
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  const handleEdit = (budget) => {
    setEditing(budget);
    setShowModal(true);
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your budgets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budgets</h1>
            <p className="text-gray-400">Set and track your spending limits</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <IoAdd size={20} />
            Create Budget
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FaChartPie className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">
                No budgets created yet
              </p>
              <p className="text-gray-400 mb-4">
                Start by creating your first budget to track spending
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Create Your First Budget
              </button>
            </div>
          ) : (
            budgets.map((budget) => {
              const spentAmount =
                spent.find((s) => s.categoryId === budget.categoryId?._id)?.spent || 0;
              const percentage = getProgressPercentage(spentAmount, budget.amount);
              const remaining = Math.max(budget.amount - spentAmount, 0);
              const daysLeft = Math.max(
                0,
                Math.ceil(
                  (new Date(budget.endDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                )
              );

              return (
                <div
                  key={budget._id}
                  className="bg-slate-900/50 border border-white/15 rounded-lg p-6 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {budget.categoryId?.name || "Overall Budget"}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(budget.startDate).toLocaleDateString()} -{" "}
                        {new Date(budget.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Spent: ₹{spentAmount.toFixed(2)}</span>
                      <span>Budget: ₹{budget.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                          percentage
                        )}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{percentage.toFixed(0)}% used</span>
                      {remaining > 0 ? (
                        <span>Remaining: ₹{remaining.toFixed(2)}</span>
                      ) : (
                        <span>
                          Over spent: ₹{(spentAmount - budget.amount).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <IoCalendarOutline />
                      <span>{daysLeft} days left</span>
                    </div>
                    <div
                      className={`font-semibold ${
                        percentage >= 100
                          ? "text-red-400"
                          : percentage >= 80
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {percentage >= 100
                        ? "Over Budget!"
                        : percentage >= 80
                        ? "Nearly Reached"
                        : "On Track"}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <BudgetModal
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
          editing={editing}
        />
      )}
    </div>
  );
};

export default Budgets;
