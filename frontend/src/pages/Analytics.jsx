import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiEndpoints, fetchWithAuth } from '../utils/api';
import { FaChartLine, FaChartPie, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Analytics = () => {
    const { user, token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('6months');

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(apiEndpoints.transactions);
            const data = await response.json();
            setTransactions(data.transactions || data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Silently handle errors for analytics - don't show toast for empty data
        } finally {
            setLoading(false);
        }
    };

    // Calculate analytics data
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netWorth = totalIncome - totalExpenses;

    const categoryWiseExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    // Prepare data for charts
    const pieData = Object.entries(categoryWiseExpenses).map(([name, value]) => ({
        name: name || 'Uncategorized',
        value
    }));

    const monthlyData = transactions.reduce((acc, t) => {
        const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            if (t.type === 'income') existing.income += t.amount;
            else existing.expenses += t.amount;
        } else {
            acc.push({
                month,
                income: t.type === 'income' ? t.amount : 0,
                expenses: t.type === 'expense' ? t.amount : 0
            });
        }
        return acc;
    }, []).slice(-6);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-300">Insights into your financial habits</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Income</p>
                                <div className="flex items-center gap-1 text-green-400 text-2xl font-bold">
                                    <FaIndianRupeeSign className="text-lg" />
                                    {formatAmount(totalIncome)}
                                </div>
                            </div>
                            <FaArrowUp className="text-green-400 text-2xl" />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Expenses</p>
                                <div className="flex items-center gap-1 text-red-400 text-2xl font-bold">
                                    <FaIndianRupeeSign className="text-lg" />
                                    {formatAmount(totalExpenses)}
                                </div>
                            </div>
                            <FaArrowDown className="text-red-400 text-2xl" />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Net Worth</p>
                                <div className={`flex items-center gap-1 text-2xl font-bold ${
                                    netWorth >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    <FaIndianRupeeSign className="text-lg" />
                                    {formatAmount(Math.abs(netWorth))}
                                </div>
                            </div>
                            <FaChartLine className={`text-2xl ${
                                netWorth >= 0 ? 'text-green-400' : 'text-red-400'
                            }`} />
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Pie Chart */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <FaChartPie className="text-purple-400" />
                            Expense by Category
                        </h2>
                        
                        {pieData.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No expense data available</p>
                        ) : (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => [`₹${formatAmount(value)}`, 'Amount']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Category List */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-white mb-4">Category Breakdown</h2>
                        
                        {Object.keys(categoryWiseExpenses).length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No expense data available</p>
                        ) : (
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {Object.entries(categoryWiseExpenses)
                                    .sort(([,a], [,b]) => b - a)
                                    .map(([category, amount], index) => {
                                        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                                        return (
                                            <div key={category} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-4 h-4 rounded-full"
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    ></div>
                                                    <span className="text-white capitalize">{category || 'Uncategorized'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 text-white font-semibold">
                                                        <FaIndianRupeeSign className="text-sm" />
                                                        {formatAmount(amount)}
                                                    </div>
                                                    <span className="text-gray-400 text-sm">{percentage}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Trends */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <FaChartLine className="text-purple-400" />
                        Income vs Expenses (Last 6 Months)
                    </h2>
                    
                    {monthlyData.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No transaction data available</p>
                    ) : (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: 'white'
                                        }}
                                        formatter={(value) => [`₹${formatAmount(value)}`, '']}
                                    />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Recent Transactions Summary */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Transaction Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-400 mb-2">Total Transactions</p>
                            <p className="text-2xl font-bold text-white">{transactions.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 mb-2">Average Transaction</p>
                            <div className="flex items-center gap-1 text-white text-xl font-semibold">
                                <FaIndianRupeeSign className="text-sm" />
                                {transactions.length > 0 
                                    ? formatAmount(Math.round(totalExpenses / transactions.filter(t => t.type === 'expense').length) || 0)
                                    : '0'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
