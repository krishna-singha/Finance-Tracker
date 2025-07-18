import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";

const initialForm = {
  title: "",
  targetAmount: "",
  currentAmount: "",
  deadline: "",
};

const GoalModal = ({ onClose, editing }) => {
  const { fetchGoals } = useData();
  const [formData, setFormData] = useState(editing ? {
    title: editing.title,
    targetAmount: editing.targetAmount,
    currentAmount: editing.currentAmount,
    deadline: editing.deadline || "",
  } : initialForm);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, targetAmount, currentAmount, deadline } = formData;
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    if (!title || isNaN(target)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (deadline && new Date(deadline) <= new Date()) {
      toast.error("Deadline must be in the future.");
      return;
    }

    if (!isNaN(target) && current > target) {
      toast.error("Current amount cannot exceed the target amount.");
      return;
    }

    try {
      const payload = {
        title,
        targetAmount: target,
        currentAmount: current,
        ...(deadline && { deadline }),
      };

      const method = editing ? axios.put : axios.post;
      const url = editing ? `/api/v1/goals/${editing._id}` : "/api/v1/goals";

      await method(url, payload);

      fetchGoals();
      toast.success(`Goal ${editing ? "updated" : "created"} successfully!`);
      setFormData(initialForm);
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save goal.";
      toast.error(msg);
      console.error("Goal save error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 text-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setFormData(initialForm);
            onClose();
          }}
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full cursor-pointer"
        >
          <IoClose size={20} />
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">
            {editing ? "Edit Goal" : "Create Goal"}
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="e.g., Emergency Fund, New Laptop"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Target Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Current Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) =>
                setFormData({ ...formData, currentAmount: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {editing ? "Update" : "Create"} Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
