import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiEndpoints, fetchWithAuth } from '../utils/api';
import { Link } from 'react-router-dom';
import { FaWallet, FaArrowUp, FaArrowDown, FaChartLine, FaPlus, FaSpinner, FaEye, FaFlag } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GeminiAI from '../components/GeminiAI';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Debug info
  // console.log('Dashboard render - User:', user);
  // console.log('Dashboard render - isAuthenticated:', isAuthenticated);
  // console.log('Dashboard render - loading:', loading);
  // console.log('Dashboard render - localStorage token:', localStorage.getItem('authToken'));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setDashboardLoading(true);
      console.log('Fetching transactions...');
      console.log('API endpoint:', apiEndpoints.transactions);
      
      const response = await fetchWithAuth(apiEndpoints.transactions);
      console.log('Response received successfully');
      
      const data = await response.json();
      
      const allTransactions = data.transactions || data || [];
      console.log('Transactions data:', allTransactions);
      
      setTransactions(allTransactions.slice(0, 10)); // Limit to recent 10 transactions
    } catch (error) {
      console.error('Error fetching transactions:', error);
      console.error('Error details:', error.message);
      setTransactions([]);
    } finally {
      setDashboardLoading(false);
    }
  };

  // Calculate stats based on category type
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Prepare chart data for expenses
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const categoryName = t.category || 'Uncategorized';
      acc[categoryName] = (acc[categoryName] || 0) + t.amount;
      return acc;
    }, {});
    
  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }))

  const monthlyData = transactions.reduce((acc, t) => {
    const date = new Date(t.date);
    const monthYear = date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    const existing = acc.find(item => item.month === monthYear);
    if (existing) {
      if (t.type === 'income') existing.income += t.amount;
      else existing.expenses += t.amount;
    } else {
      acc.push({
        month: monthYear,
        income: t.type === 'income' ? t.amount : 0,
        expenses: t.type === 'expense' ? t.amount : 0,
        sortDate: date
      });
    }
    return acc;
  }, [])
  .sort((a, b) => a.sortDate - b.sortDate) // Sort by date ascending (oldest to newest)
  .slice(-6) // Take last 6 months
  .map(({ sortDate, ...rest }) => rest); // Remove sortDate from final data

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-purple-400 mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6">
      
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-gray-300">Here's an overview of your financial activity</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">Current Balance</p>
                <div className={`flex items-center gap-2 text-3xl font-bold mt-2 ${
                  balance >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <FaIndianRupeeSign className="text-xl" />
                  {formatAmount(Math.abs(balance))}
                </div>
                <div className={`text-xs mt-1 ${balance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {balance >= 0 ? '↗ Positive Balance' : '↘ Negative Balance'}
                </div>
              </div>
              <div className={`p-4 rounded-full ${balance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} border-2 ${balance >= 0 ? 'border-green-400/30' : 'border-red-400/30'}`}>
                <FaWallet className={`text-3xl ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">Total Income</p>
                <div className="flex items-center gap-2 text-green-400 text-3xl font-bold mt-2">
                  <FaIndianRupeeSign className="text-xl" />
                  {formatAmount(totalIncome)}
                </div>
                <div className="text-xs text-green-300 mt-1">
                  ↗ Monthly earnings
                </div>
              </div>
              <div className="p-4 rounded-full bg-green-500/20 border-2 border-green-400/30">
                <FaArrowUp className="text-green-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">Total Expenses</p>
                <div className="flex items-center gap-2 text-red-400 text-3xl font-bold mt-2">
                  <FaIndianRupeeSign className="text-xl" />
                  {formatAmount(totalExpenses)}
                </div>
                <div className="text-xs text-red-300 mt-1">
                  ↘ Monthly spending
                </div>
              </div>
              <div className="p-4 rounded-full bg-red-500/20 border-2 border-red-400/30">
                <FaArrowDown className="text-red-400 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Expense Categories Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Expense Categories</h2>
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
                <FaChartLine className="text-purple-400" />
              </div>
            </div>
            {pieData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {COLORS.map((color, index) => (
                        <linearGradient key={`gradient-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
                        const RADIAN = Math.PI / 180;
                        // Position the label further from the pie
                        const radius = outerRadius * 1.2;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        
                        // Only show label for segments with sufficient percentage
                        return percent > 0.05 ? (
                          <text 
                            x={x} 
                            y={y} 
                            fill="white"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize={12}
                            fontWeight="500"
                            opacity={0.9}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        ) : null;
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#colorGradient-${index % COLORS.length})`} 
                          stroke={COLORS[index % COLORS.length]} 
                          strokeWidth={1.5}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`₹${formatAmount(value)}`, 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Category Legend */}
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-sm mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-white truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <div className="p-4 rounded-full bg-gray-500/20 mb-4">
                  <FaChartLine className="text-3xl" />
                </div>
                <p className="text-lg font-medium">No expense data available</p>
                <p className="text-sm">Start adding expenses to see insights</p>
              </div>
            )}
          </div>

          {/* Monthly Trend Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Monthly Trends</h2>
              <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                <FaArrowUp className="text-blue-400" />
              </div>
            </div>
            {monthlyData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(30, 41, 59, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`₹${formatAmount(value)}`, '']}
                    />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGradient)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <div className="p-4 rounded-full bg-gray-500/20 mb-4">
                  <FaArrowUp className="text-3xl" />
                </div>
                <p className="text-lg font-medium">No trend data available</p>
                <p className="text-sm">Add transactions to see monthly trends</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          {/* <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                <FaPlus className="text-purple-400" />
              </div>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/incomes"
                className="group w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaPlus className="text-sm" />
                </div>
                <span>Add Income</span>
                <FaArrowUp className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/expenses"
                className="group w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaPlus className="text-sm" />
                </div>
                <span>Add Expense</span>
                <FaArrowDown className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/analytics"
                className="group w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaChartLine className="text-sm" />
                </div>
                <span>View Analytics</span>
                <FaEye className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/budgets"
                className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaWallet className="text-sm" />
                </div>
                <span>Manage Budgets</span>
                <FaArrowUp className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/goals"
                className="group w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaFlag className="text-sm" />
                </div>
                <span>Track Goals</span>
                <FaFlag className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/all-transactions"
                className="group w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-white/20">
                  <FaEye className="text-sm" />
                </div>
                <span>All Transactions</span>
                <FaArrowUp className="ml-auto text-sm opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div> */}

          {/* Recent Transactions */}
          <div className="flex flex-col h-[40rem] lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
                  <FaArrowUp className="text-indigo-400" />
                </div>
                Recent Transactions
              </h2>
              <Link
                to="/all-transactions"
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors font-medium px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30"
              >
                View All →
              </Link>
            </div>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-6 rounded-full bg-gray-500/20 mb-6 mx-auto w-fit">
                  <FaWallet className="text-4xl text-gray-400" />
                </div>
                <p className="text-gray-300 text-lg font-medium mb-2">No transactions yet</p>
                <p className="text-gray-400 text-sm mb-6">Start by adding your first income or expense</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/incomes"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Add Income
                  </Link>
                  <Link
                    to="/expenses"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Add Expense
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'income' ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'
                      }`}>
                        {transaction.type === 'income' ? 
                          <FaArrowUp className="text-green-400" /> : 
                          <FaArrowDown className="text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg">{transaction.note || 'No description'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-300 text-sm bg-gray-500/20 px-2 py-1 rounded-lg">
                            {transaction.category || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-2 font-bold text-xl ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <FaIndianRupeeSign className="text-base" />
                        {formatAmount(transaction.amount)}
                      </div>
                      <p className="text-gray-400 text-sm mt-1 bg-gray-500/20 px-2 py-1 rounded-lg inline-block">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Financial Assistant */}
        <div className="mb-8">
          <GeminiAI transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
