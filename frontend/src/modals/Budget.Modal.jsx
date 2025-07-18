import { useState } from "react";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const initialForm = () => ({
  categoryId: "",
  amount: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
});

const BudgetModal = ({ onClose, editing }) => {
  const { categories, fetchBudgets } = useData();
  const [formData, setFormData] = useState(
    editing
      ? {
          categoryId: editing.categoryId?._id || "",
          amount: editing.amount,
          startDate: new Date(editing.startDate).toISOString().split("T")[0],
          endDate: new Date(editing.endDate).toISOString().split("T")[0],
        }
      : initialForm()
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const url = editing
        ? `/api/v1/budgets/${editing._id}`
        : "/api/v1/budgets";

      const method = editing ? axios.put : axios.post;

      const response = await method(url, {
        categoryId: formData.categoryId,
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      toast.success(`Budget ${editing ? "updated" : "created"} successfully!`);
      fetchBudgets();
      setFormData(initialForm());
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed to save budget");
      } else {
        console.error("Error saving budget:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 text-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative space-y-6">
        <button
          onClick={() => {
            setFormData(initialForm());
            onClose();
          }}
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Edit Budget" : "Create New Budget"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Category (optional)
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            >
              <option value="">Overall Budget (No Category)</option>
              {categories &&
                categories
                  .filter((c) => c.type === "expense")
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Budget Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Date *</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {editing ? "Update" : "Create"} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
