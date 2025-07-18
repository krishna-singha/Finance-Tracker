import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import toast from "react-hot-toast";
import {
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { FaArrowDown, FaRupeeSign } from "react-icons/fa";
import axios from "axios";

const initialForm = () => ({
  category: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const Expenses = () => {
  const { isAuthenticated } = useAuth();
  const { data, fetchTransections, categories, fetchCategories } = useData();

  const [formData, setFormData] = useState(initialForm());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ category: "", date: "" });

  const expenses = useMemo(
    () => (data || []).filter((item) => item.type === "expense"),
    [data]
  );

  const filtered = useMemo(() => {
    return expenses.filter(({ category, date }) => {
      const categoryMatch = !filters.category || filters.category === category;
      const dateMatch =
        !filters.date ||
        new Date(date).toISOString().split("T")[0] === filters.date;
      return categoryMatch && dateMatch;
    });
  }, [expenses, filters]);

  const total = useMemo(
    () => filtered.reduce((sum, item) => sum + item.amount, 0),
    [filtered]
  );

  const handleInputChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setFormData(initialForm());
    setEditing(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, amount, description, date } = formData;

    if (!category || !amount) {
      toast.error("Category and amount are required");
      return;
    }

    const payload = {
      category,
      amount: parseFloat(amount),
      note: description,
      type: "expense",
      date,
    };

    try {
      const url = editing
        ? `/api/v1/transactions/${editing._id}`
        : "/api/v1/transactions";
      const method = editing ? axios.put : axios.post;

      const res = await method(url, payload);

      toast.success(editing ? "Expense updated!" : "Expense added!");
      fetchTransections();
      resetForm();
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const handleDelete = async (id) => {
  try {
    // Step 1: Check if category is in use
    const checkRes = await axios.delete(`/api/v1/categories/${id}`);
    const { warn, count, message } = checkRes.data;

    if (warn) {
      const confirmDelete = confirm(
        `${message}\n\nDo you still want to delete this category and all related transactions?`
      );

      if (!confirmDelete) return;

      // Step 2: Force delete
      await axios.delete(`/api/v1/categories/${id}?force=true`);
      toast.success("Category and related transactions deleted!");
    } else {
      toast.success("Category deleted");
    }

    fetchCategories();
  } catch {
    toast.error("Delete failed");
  }
};


  const handleEdit = (expense) => {
    setFormData({
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.note || "",
      date: new Date(expense.date).toISOString().split("T")[0],
    });
    setEditing(expense);
    setShowModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>Please log in to view your expenses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 lg:p-6 animate-slide-in-up max-w-7xl w-full mx-auto space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text">
            Expenses
          </h1>
          <p className="text-gray-300">Track and manage your expenses</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setFormData(initialForm());
          }}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl flex items-center gap-2 font-medium shadow-md"
        >
          <IoAdd size={20} />
          Add Expense
        </button>
      </header>

      {/* Stats */}
      <div className="bg-white/10 rounded-xl p-4 flex gap-4 items-center">
        <div className="p-3 bg-red-500 rounded-full">
          <FaRupeeSign />
        </div>
        <div>
          <p className="text-sm text-gray-300">Total Expenses</p>
          <h2 className="text-2xl font-bold text-red-400">
            ₹{total.toLocaleString("en-IN")}
          </h2>
          <p className="text-gray-400 text-sm">{filtered.length} expenses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          className="bg-gray-700 p-2 rounded-xl"
        >
          <option value="">All Categories</option>
          {categories &&
            categories
              .filter((c) => c.type === "expense")
              .map((c, i) => (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              ))}
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, date: e.target.value }))
          }
          className="bg-gray-700 p-2 rounded-xl"
        />
        <button
          onClick={() => setFilters({ category: "", date: "" })}
          className="bg-gray-600 p-2 rounded-xl"
        >
          Clear Filters
        </button>
      </div>

      {/* Expenses */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No expenses found.</p>
        ) : (
          filtered.map((exp) => (
            <div
              key={exp._id}
              className="bg-white/10 p-4 rounded-xl flex justify-between items-center border border-transparent hover:border hover:border-white/40 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-500/20 p-2 rounded-lg group-hover:bg-red-500/30 transition-colors">
                  <FaArrowDown size={20} className="text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-6">
                    <h3 className="text-lg font-semibold">{exp.category}</h3>

                    <p className="text-xs text-gray-400">
                      {new Date(exp.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                        second: "2-digit",
                        minute: "2-digit",
                        hour: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">{exp.note}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-red-400 font-bold">
                  -₹{exp.amount.toLocaleString("en-IN")}
                </span>
                <button onClick={() => handleEdit(exp)}>
                  <IoCreateOutline className="text-blue-400" />
                </button>
                <button onClick={() => handleDelete(exp._id)}>
                  <IoTrashOutline className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editing ? "Edit" : "Add"} Expense
            </h2>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-xl"
              required
            >
              <option value="">Select Category</option>
              {categories &&
                categories
                  .filter((c) => c.type === "expense")
                  .map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-xl"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-xl"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full bg-gray-700 p-2 rounded-xl"
            />
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-600 p-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 p-2 rounded-xl"
              >
                {editing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Expenses;
