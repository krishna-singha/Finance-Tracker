import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiEndpoints, fetchWithAuth } from '../utils/api';
import { toast } from 'react-toastify';
import { IoAdd, IoCreateOutline, IoTrashOutline, IoWalletOutline, IoCalendarOutline } from 'react-icons/io5';
import { FaChartPie } from 'react-icons/fa';

const Budgets = () => {
  const { user, isAuthenticated } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgets();
      fetchCategories();
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(apiEndpoints.budgets);
      const data = await response.json();
      setBudgets(data.budgets || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth(apiEndpoints.categories);
      const data = await response.json();
      const allCategories = data.categories || [];
      // Only expense categories for budgets
      const expenseCategories = allCategories.filter(cat => cat.type === 'expense');
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetchWithAuth(`${apiEndpoints.transactions}?type=expense`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const calculateSpent = (budget) => {
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    
    return transactions
      .filter(t => 
        t.categoryId?._id === budget.categoryId?._id &&
        new Date(t.date) >= startDate &&
        new Date(t.date) <= endDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const url = editingBudget 
        ? apiEndpoints.budgetById(editingBudget._id)
        : apiEndpoints.budgets;
      
      const method = editingBudget ? 'PUT' : 'POST';

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          categoryId: formData.categoryId,
          amount: parseFloat(formData.amount),
          startDate: formData.startDate,
          endDate: formData.endDate
        })
      });

      const result = await response.json();
      toast.success(editingBudget ? 'Budget updated!' : 'Budget created!');
      fetchBudgets();
      resetForm();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      await fetchWithAuth(apiEndpoints.budgetById(id), {
        method: 'DELETE'
      });

      toast.success('Budget deleted!');
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId?._id || '',
      amount: budget.amount.toString(),
      startDate: new Date(budget.startDate).toISOString().split('T')[0],
      endDate: new Date(budget.endDate).toISOString().split('T')[0]
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setEditingBudget(null);
    setShowAddModal(false);
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Budgets</h1>
            <p className="text-gray-400">Set and track your spending limits</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <IoAdd size={20} />
            Create Budget
          </button>
        </div>

        {/* Budget List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FaChartPie className="text-6xl text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No budgets created yet</p>
              <p className="text-gray-500 mb-4">Start by creating your first budget to track spending</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
              >
                Create Your First Budget
              </button>
            </div>
          ) : (
            budgets.map(budget => {
              const spent = calculateSpent(budget);
              const percentage = getProgressPercentage(spent, budget.amount);
              const remaining = Math.max(budget.amount - spent, 0);
              const daysLeft = Math.max(0, Math.ceil((new Date(budget.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

              return (
                <div key={budget._id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{budget.categoryId?.name || 'Unknown Category'}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
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
                      <span>Spent: ₹{spent.toFixed(2)}</span>
                      <span>Budget: ₹{budget.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{percentage.toFixed(0)}% used</span>
                      <span>₹{remaining.toFixed(2)} remaining</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <IoCalendarOutline />
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className={`font-semibold ${
                      percentage >= 100 ? 'text-red-400' : 
                      percentage >= 80 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {percentage >= 100 ? 'Over Budget!' : 
                       percentage >= 80 ? 'Nearly Reached' : 'On Track'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingBudget ? 'Edit Budget' : 'Create New Budget'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                  required
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
