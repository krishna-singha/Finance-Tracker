import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import toast from 'react-hot-toast';
import {
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { FaArrowUp, FaRupeeSign } from "react-icons/fa";

const Incomes = () => {
  const { user, isAuthenticated } = useAuth();
  const { data, fetchTransactions, categories } = useData();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const exp = data.filter((data) => data.type === "income");
      setIncomes(exp);
    } else {
      setIncomes([]);
    }
    setLoading(false);
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      
      const url = editingIncome
        ? apiEndpoints.transactionById(editingIncome._id)
        : apiEndpoints.transactions;

      const method = editingIncome ? "PUT" : "POST";

      // Transform data to match backend API
      const requestData = {
        category: formData.category,
        type: "income",
        amount: parseFloat(formData.amount),
        note: formData.description || "",
        date: formData.date,
      };

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      toast.success(editingIncome ? "Income updated!" : "Income added!");
      fetchTransactions();
      resetForm();
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("Failed to save income");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      const response = await fetchWithAuth(apiEndpoints.transactionById(id), {
        method: "DELETE",
      });

      toast.success("Income deleted!");
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setFormData({
      amount: income.amount.toString(),
      category: income.category,
      description: income.note || "",
      date: new Date(income.date).toISOString().split("T")[0],
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
    setEditingIncome(null);
    setShowAddModal(true);
  };

  const resetForm = (closeModal = true) => {
    setFormData({
      category: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditingIncome(null);
    if (closeModal) {
      setShowAddModal(false);
    }
  };

      


  const filteredIncomes = incomes.filter((income) => {
    const categoryMatch = !filterCategory || income.category === filterCategory;
    const dateMatch =
      !filterDate ||
      new Date(income.date).toISOString().split("T")[0] === filterDate;
    return categoryMatch && dateMatch;
  });

  const totalIncome = filteredIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your income.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Income</h1>
            <p className="text-gray-400">
              Track and manage your income sources
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <IoAdd size={20} />
            Add Income
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-lg">
              <IoTrendingUpOutline size={24} />
            </div>
            <div>
              <p className="text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-400">
                &#8377;{totalIncome.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">All Categories</option>
                {categories
                  .filter((category) => category.type === "income")
                  .map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterCategory("");
                  setFilterDate("");
                }}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Income List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Income</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading income...</p>
            </div>
          ) : filteredIncomes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No income found</p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-green-400 hover:text-green-300"
              >
                Add your first income
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIncomes.map((income, index) => (
                // <div
                //   key={income._id}
                //   className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                // >
                <div
                  key={income._id}
                  className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 
                              rounded-xl p-5 hover:border-green-500/30 transition-all duration-300 
                              hover:shadow-lg hover:shadow-green-500/10 group animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-4">
                        <div className="bg-green-500/20 p-2 rounded-lg group-hover:bg-green-500/30 transition-colors">
                          <FaArrowUp size={20} className="text-green-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                              {income.category}
                            </h3>
                            <span>•</span>
                            <span>
                              {new Date(income.date).toLocaleDateString(
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
                          {income.note && (
                            <p className="text-sm text-gray-300 mt-2 italic">
                              {income.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-green-400">
                        +&#8377;{income.amount.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(income)}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <IoCreateOutline size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(income._id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <IoTrashOutline size={16} />
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingIncome ? "Edit Income" : "Add New Income"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select category</option>
                  {categories
                    .filter((category) => category.type === "income")
                    .map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    &#8377;
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-3 py-2"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 h-20 resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
                >
                  {editingIncome ? "Update" : "Add"} Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;
