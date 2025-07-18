import { useState } from "react";
import { useData } from "../contexts/DataContext";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";

const GoalContributionModal = ({ onClose, selectedGoal, getProgressPercentage }) => {
  const { fetchGoals } = useData();

  const [contributionAmount, setContributionAmount] = useState("");

  const formatAmount = (amt) =>
    Number(amt) % 1 === 0
      ? Number(amt).toLocaleString("en-IN", { maximumFractionDigits: 0 })
      : Number(amt).toLocaleString("en-IN", { minimumFractionDigits: 2 });

  const handleContribution = async (e) => {
    e.preventDefault();
    const amountToAdd = parseFloat(contributionAmount);

    if (!amountToAdd || amountToAdd <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const newTotal = selectedGoal.currentAmount + amountToAdd;

    if (newTotal > selectedGoal.targetAmount) {
      const excess = newTotal - selectedGoal.targetAmount;
      toast.error(`You're exceeding the goal by ₹${formatAmount(excess)}`);
      return;
    }

    try {
      await axios.put(`/api/v1/goals/${selectedGoal._id}`, {
        ...selectedGoal,
        currentAmount: newTotal,
      });

      fetchGoals();
      toast.success("Contribution added!");
      setContributionAmount("");
      onClose();
    } catch (error) {
      console.error("Error adding contribution:", error);
      toast.error(error.response?.data?.message || "Failed to add contribution");
    }
  };

  const progress = getProgressPercentage(
    selectedGoal.currentAmount,
    selectedGoal.targetAmount
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8">
      <div className="bg-gray-800 text-white w-full max-w-md p-6 rounded-2xl shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setContributionAmount("");
            onClose();
          }}
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
        >
          <IoClose size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold">
          Add Money to "{selectedGoal.title}"
        </h2>

        {/* Progress Bar */}
        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span>Current: ₹{formatAmount(selectedGoal.currentAmount)}</span>
            <span>Target: ₹{formatAmount(selectedGoal.targetAmount)}</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleContribution} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount to Add *</label>
            <input
              type="number"
              step="0.01"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              placeholder="0.00"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
          >
            Add Money
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalContributionModal;
