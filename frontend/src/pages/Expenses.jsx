import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import { toast } from "react-toastify";
import {
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { FaArrowDown, FaRupeeSign } from "react-icons/fa";
import { defaultCategories } from "../constants/category";

const Expenses = () => {
  const { user, isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${apiEndpoints.transactions}?type=expense`
      );
      const data = await response.json();
      setExpenses(data.transactions || data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      if (error.message && error.message.includes("HTTP error")) {
        toast.error("Failed to load expenses");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const url = editingExpense
        ? apiEndpoints.transactionById(editingExpense._id)
        : apiEndpoints.transactions;

      const method = editingExpense ? "PUT" : "POST";

      // Transform data to match backend API
      const requestData = {
        category: formData.category,
        type: "expense",
        amount: parseFloat(formData.amount),
        note: formData.description || "",
        date: formData.date,
      };

      // console.log("Sending transaction data:", requestData); // Debug log

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      toast.success(editingExpense ? "Expense updated!" : "Expense added!");
      fetchExpenses();
      resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const response = await fetchWithAuth(apiEndpoints.transactionById(id), {
        method: "DELETE",
      });

      toast.success("Expense deleted!");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.note || "",
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingExpense(null);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingExpense(null);
    setShowAddModal(false);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch = !filterCategory || expense.category === filterCategory;
    const dateMatch = !filterDate || new Date(expense.date).toISOString().split("T")[0] === filterDate;

    return categoryMatch && dateMatch;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your expenses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-6 animate-slide-in-up">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Expenses
            </h1>
            <p className="text-gray-400 text-lg">
              Track and manage your expenses effortlessly
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 
                     shadow-lg hover:shadow-red-500/25 font-medium"
          >
            <IoAdd size={20} />
            Add Expense
          </button>
        </div>

        {/* Enhanced Stats Card */}
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 
                      shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
              <FaRupeeSign size={28} className="text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-red-400 animate-pulse-soft">
                &#8377;{totalExpenses.toFixed(2)}
              </p>
              <p className="text-gray-500 text-sm">
                {filteredExpenses.length} transactions
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 
                      shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <IoFilterOutline size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 
                         focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                         hover:bg-gray-700 backdrop-blur-sm"
              >
                <option value="">All Categories</option>
                {defaultCategories
                  .filter((category) => category.type === "expense")
                  .map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                           hover:bg-gray-700 backdrop-blur-sm"
                />
                <IoCalendarOutline
                  size={18}
                  className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory("");
                  setFilterDate("");
                }}
                className="w-full bg-gray-600/50 hover:bg-gray-500 border border-gray-600 px-4 py-3 rounded-xl 
                         transition-all duration-300 font-medium hover:border-gray-500 backdrop-blur-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Expenses List */}
        <div
          className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 
                      shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto"></div>
              <p className="mt-6 text-gray-400 text-lg">
                Loading your expenses...
              </p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="bg-red-500/10 p-6 rounded-2xl mx-auto w-fit">
                <FaRupeeSign size={48} className="text-red-400 mx-auto" />
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-lg">No expenses found</p>
                <p className="text-gray-500 text-sm">
                  Start tracking your spending today
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                         px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-medium"
              >
                Add your first expense
              </button>
            </div>
          ) : (
            <div className="space-y-4 custom-scrollbar max-h-[500px] overflow-y-auto">
              {filteredExpenses.map((expense, index) => (
                <div
                  key={expense._id}
                  className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 
                              rounded-xl p-5 hover:border-red-500/30 transition-all duration-300 
                              hover:shadow-lg hover:shadow-red-500/10 group animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-4">
                        <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
                          <FaArrowDown size={20} color="red" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                              {expense.category}
                            </h3>
                            <span>•</span>
                            <span>
                              {new Date(expense.date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {expense.note && (
                            <p className="text-sm text-gray-300 mt-2 italic">
                              {expense.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
                        -&#8377;{expense.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 
                                   rounded-lg transition-all duration-300"
                        >
                          <IoCreateOutline size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 
                                   rounded-lg transition-all duration-300"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-slide-in-up">
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 
                        w-full max-w-md shadow-2xl transform transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500/20 p-2 rounded-xl">
                <FaRupeeSign size={20} className="text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                           hover:bg-gray-700 backdrop-blur-sm placeholder-gray-400"
                  placeholder="Enter expense title"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 
                           focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                           hover:bg-gray-700 backdrop-blur-sm"
                  required
                >
                  <option value="">Select category</option>
                  {defaultCategories
                    .filter((category) => category.type === "expense")
                    .map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">
                    &#8377;
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl pl-8 pr-4 py-3 
                             focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                             hover:bg-gray-700 backdrop-blur-sm placeholder-gray-400"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 
                             focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                             hover:bg-gray-700 backdrop-blur-sm"
                    required
                  />
                  <IoCalendarOutline
                    size={18}
                    className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 h-24 resize-none
                           focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300
                           hover:bg-gray-700 backdrop-blur-sm placeholder-gray-400"
                  placeholder="Add a description (optional)"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600/50 hover:bg-gray-500 border border-gray-600 py-3 rounded-xl 
                           transition-all duration-300 font-medium hover:border-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                           py-3 rounded-xl transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
                >
                  {editingExpense ? "Update" : "Add"} Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
