import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAdd,
  IoCreateOutline,
  IoTrashOutline,
  IoTrophyOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { FaFlag, FaPlus } from "react-icons/fa";
import GoalModal from "../modals/Goal.Modal";
import GoalContributionModal from "../modals/GoalContribution.Modal";

const Goals = () => {
  const { isAuthenticated } = useAuth();
  const { goals, fetchGoals, setGoals } = useData();

  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      await axios.delete(`/api/v1/goals/${id}`);
      toast.success("Goal deleted successfully!");
      fetchGoals();
    } catch {
      toast.error("Failed to delete goal");
    }
  };

  const handleAddGoal = () => {
    setEditing(null);
    setShowModal("addOrEdit");
  };

  const handleEdit = (goal) => {
    setEditing(goal);
    setShowModal("addOrEdit");
  };

  const handleContribution = (goal) => {
    setSelectedGoal(goal);
    setShowModal("contribute");
  };

  const getProgressPercentage = (current, target) =>
    Math.min((current / target) * 100, 100);

  const getProgressColor = (percent) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 75) return "bg-blue-500";
    if (percent >= 50) return "bg-yellow-500";
    return "bg-purple-500";
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const formatFraction = (amt) =>
    Number(amt) % 1 === 0 ? amt.toFixed(0) : amt.toFixed(2);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your goals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
            <p className="text-gray-400">Set and track your financial goals</p>
          </div>
          <button
            onClick={handleAddGoal}
            className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <IoAdd size={20} />
            Create Goal
          </button>
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FaFlag className="text-6xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-300 mb-2">No goals created yet</p>
              <p className="text-gray-400 mb-4">Start by creating your first savings goal</p>
              <button
                onClick={handleAddGoal}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg cursor-pointer"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const percent = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const daysLeft = getDaysLeft(goal.deadline);
              const isCompleted = percent >= 100;

              return (
                <div
                  key={goal._id}
                  className="bg-slate-900/50 border border-white/15 rounded-lg p-6 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isCompleted ? (
                          <IoTrophyOutline className="text-yellow-400 text-xl" />
                        ) : (
                          <FaFlag className="text-purple-400" />
                        )}
                        <h3 className="text-lg font-semibold">{goal.title}</h3>
                      </div>
                      {goal.deadline && (
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <IoCalendarOutline />
                          {daysLeft ? `${daysLeft} days left` : "Deadline passed"}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(goal)} className="p-2 text-blue-400 cursor-pointer">
                        <IoCreateOutline size={16} />
                      </button>
                      <button onClick={() => handleDelete(goal._id)} className="p-2 text-red-400 cursor-pointer">
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Saved: ₹{formatFraction(goal.currentAmount)}</span>
                      <span>Target: ₹{formatFraction(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                          percent
                        )}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{formatFraction(percent)}% complete</span>
                      <span>
                        ₹{formatFraction(goal.targetAmount - goal.currentAmount)} to go
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCompleted ? (
                      <button
                        onClick={() => handleContribution(goal)}
                        className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1"
                      >
                        <FaPlus size={12} />
                        Add Money
                      </button>
                    ) : (
                      <div className="flex-1 bg-yellow-600 py-2 px-3 rounded-lg text-sm text-center font-semibold">
                        🎉 Goal Achieved!
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showModal === "addOrEdit" && (
        <GoalModal
          isOpen={true}
          onClose={() => {
            setShowModal("");
            setEditing(null);
          }}
          editing={editing}
        />
      )}

      {showModal === "contribute" && (
        <GoalContributionModal
          onClose={() => {
            setShowModal("");
            setSelectedGoal(null);
          }}
          selectedGoal={selectedGoal}
          getProgressPercentage={getProgressPercentage}
        />
      )}
    </div>
  );
};

export default Goals;
