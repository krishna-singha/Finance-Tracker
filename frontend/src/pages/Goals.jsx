import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiEndpoints, fetchWithAuth } from '../utils/api';
import { toast } from 'react-toastify';
import { IoAdd, IoCreateOutline, IoTrashOutline, IoTrophyOutline, IoCalendarOutline } from 'react-icons/io5';
import { FaFlag, FaPlus, FaMinus } from 'react-icons/fa';

const Goals = () => {
  const { user, isAuthenticated } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(apiEndpoints.goals);
      const data = await response.json();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.deadline && new Date(formData.deadline) <= new Date()) {
      toast.error('Deadline must be in the future');
      return;
    }

    try {
      const url = editingGoal 
        ? apiEndpoints.goalById(editingGoal._id)
        : apiEndpoints.goals;
      
      const method = editingGoal ? 'PUT' : 'POST';

      const requestData = {
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        ...(formData.deadline && { deadline: formData.deadline })
      };

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      toast.success(editingGoal ? 'Goal updated!' : 'Goal created!');
      fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleContribution = async (e) => {
    e.preventDefault();
    
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetchWithAuth(apiEndpoints.goalById(selectedGoal._id), {
        method: 'PUT',
        body: JSON.stringify({
          title: selectedGoal.title,
          targetAmount: selectedGoal.targetAmount,
          currentAmount: selectedGoal.currentAmount + parseFloat(contributionAmount),
          deadline: selectedGoal.deadline
        })
      });

      const result = await response.json();
      toast.success('Contribution added!');
      fetchGoals();
      setShowContributeModal(false);
      setSelectedGoal(null);
      setContributionAmount('');
    } catch (error) {
      console.error('Error adding contribution:', error);
      toast.error('Failed to add contribution');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await fetchWithAuth(apiEndpoints.goalById(id), {
        method: 'DELETE'
      });

      toast.success('Goal deleted!');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  const openContributeModal = (goal) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: ''
    });
    setEditingGoal(null);
    setShowAddModal(false);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to view your goals.</p>
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
            <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
            <p className="text-gray-400">Set and track your financial goals</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <IoAdd size={20} />
            Create Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FaFlag className="text-6xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No goals created yet</p>
              <p className="text-gray-500 mb-4">Start by creating your first savings goal</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          ) : (
            goals.map(goal => {
              const percentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysLeft = getDaysLeft(goal.deadline);
              const isCompleted = percentage >= 100;

              return (
                <div key={goal._id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
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
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <IoCalendarOutline />
                          {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Saved: ₹{goal.currentAmount.toFixed(2)}</span>
                      <span>Target: ₹{goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{percentage.toFixed(0)}% complete</span>
                      <span>₹{remaining.toFixed(2)} to go</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCompleted && (
                      <button
                        onClick={() => openContributeModal(goal)}
                        className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <FaPlus size={12} />
                        Add Money
                      </button>
                    )}
                    {isCompleted && (
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

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  placeholder="e.g., Emergency Fund, Vacation, New Car"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
                >
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Add Money to "{selectedGoal.title}"
            </h2>
            
            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Current: ₹{selectedGoal.currentAmount.toFixed(2)}</span>
                <span>Target: ₹{selectedGoal.targetAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{ width: `${getProgressPercentage(selectedGoal.currentAmount, selectedGoal.targetAmount)}%` }}
                ></div>
              </div>
            </div>
            
            <form onSubmit={handleContribution} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount to Add *</label>
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowContributeModal(false);
                    setSelectedGoal(null);
                    setContributionAmount('');
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
                >
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
