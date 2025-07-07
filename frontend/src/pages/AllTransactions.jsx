import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiEndpoints, fetchWithAuth } from '../utils/api';
import { FaSearch, FaFilter, FaArrowUp, FaArrowDown, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';

const AllTransactions = () => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    useEffect(() => {
        filterAndSortTransactions();
    }, [transactions, searchTerm, filterType, sortBy, sortOrder]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(apiEndpoints.transactions);
            const data = await response.json();
            setTransactions(data.transactions || data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Silently handle errors - don't show toast for empty data
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortTransactions = () => {
        let filtered = [...transactions];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'amount':
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case 'category':
                    aValue = a.category.toLowerCase();
                    bValue = b.category.toLowerCase();
                    break;
                case 'date':
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredTransactions(filtered);
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const response = await fetchWithAuth(apiEndpoints.transactionById(id), {
                method: 'DELETE'
            });

            setTransactions(transactions.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN').format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Loading transactions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">All Transactions</h1>
                    <p className="text-gray-300">Complete history of your financial transactions</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-white/20 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expenses</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white/20 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="category">Sort by Category</option>
                        </select>

                        {/* Sort Order */}
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                            {sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
                            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <p className="text-gray-400 text-sm">Total Transactions</p>
                        <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <p className="text-gray-400 text-sm">Total Income</p>
                        <div className="flex items-center gap-1 text-green-400 text-2xl font-bold">
                            <FaIndianRupeeSign className="text-lg" />
                            {formatAmount(filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
                        <p className="text-gray-400 text-sm">Total Expenses</p>
                        <div className="flex items-center gap-1 text-red-400 text-2xl font-bold">
                            <FaIndianRupeeSign className="text-lg" />
                            {formatAmount(filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
                    {filteredTransactions.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-400">No transactions found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-gray-300 font-semibold">Date</th>
                                        <th className="px-6 py-4 text-left text-gray-300 font-semibold">Description</th>
                                        <th className="px-6 py-4 text-left text-gray-300 font-semibold">Category</th>
                                        <th className="px-6 py-4 text-left text-gray-300 font-semibold">Type</th>
                                        <th className="px-6 py-4 text-right text-gray-300 font-semibold">Amount</th>
                                        <th className="px-6 py-4 text-center text-gray-300 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map((transaction, index) => (
                                        <tr 
                                            key={transaction._id} 
                                            className={`border-t border-gray-600 hover:bg-white/5 transition-colors ${
                                                index % 2 === 0 ? 'bg-white/5' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-gray-300">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-2 py-1 text-xs bg-purple-600 text-white rounded-full capitalize">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full capitalize ${
                                                    transaction.type === 'income' 
                                                        ? 'bg-green-600 text-white' 
                                                        : 'bg-red-600 text-white'
                                                }`}>
                                                    {transaction.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                                                    {transaction.type}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-right font-semibold ${
                                                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <FaIndianRupeeSign className="text-sm" />
                                                    {formatAmount(transaction.amount)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteTransaction(transaction._id)}
                                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/20 rounded-lg transition-colors"
                                                        title="Delete transaction"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllTransactions;