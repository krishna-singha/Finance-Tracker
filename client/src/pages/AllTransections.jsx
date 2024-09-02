import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/userAtom';
import { allTransectionAtom } from '../store/allTransectionAtom';

const AllTransactions = () => {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    const transactions = useRecoilValue(allTransectionAtom);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            if (filter === 'All') return true;
            return transaction.type === filter;
        });
    }, [transactions, filter]);

    if (loading) {
        return <div className="text-white flex justify-center items-center min-h-screen">Loading transactions...</div>;
    }

    return (
        <div className="text-white bg-primary max-w-[1550px] mx-auto min-h-screen my-4 rounded-xl py-6 px-8">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-[#09C9C8]">Transactions</h1>
                <div className="flex gap-4">
                    {['All', 'income', 'expense', 'stock'].map(category => (
                        <div
                            key={category}
                            className={`border rounded-xl py-1 px-3 cursor-pointer transition duration-300 ease-in-out hover:border-[#09C9C8] hover:text-[#09C9C8] ${filter === category ? 'border-[#09C9C8] text-[#09C9C8]' : ''
                                }`}
                            onClick={() => setFilter(category)}
                        >
                            <h2>{category}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 rounded-xl p-6">
                <table className="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr className="font-bold h-12 bg-[#0A0F27]">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 max-w-[40%]">Source / Name</th>
                            <th className="px-6 py-4 text-center">Amount</th>
                            <th className="px-6 py-4 text-center">Type</th>
                        </tr>
                    </thead>
                    <tbody className="text-[0.9rem]">
                        {filteredTransactions.map((transaction, index) => (
                            <tr
                                key={index}
                                className={`border-b border-[#ffffff0a] bg-[#181C3A] ${index % 2 === 0 ? 'bg-[#1F243E]' : ''
                                    } hover:bg-[#1A1F38] transition-colors duration-200 ease-in-out`}
                            >
                                <td className="px-6 py-4">{transaction.date}</td>
                                <td className="px-6 py-4 max-w-[40%]">{transaction.name}</td>
                                <td className={`px-6 py-4 text-center ${transaction.type === "expense" || transaction.status === "hold" ? 'text-red-500'
                                    : 'text-green-500'}`}>
                                    {transaction.type === "expense" || transaction.status === "hold" ? '-' : ''}
                                    <FaIndianRupeeSign className='inline-block' />
                                    {Math.abs(transaction.amount).toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 flex justify-center">
                                    <div
                                        className={`${transaction.type === 'income'
                                            ? 'bg-teal-500'
                                            : transaction.type === 'expense'
                                                ? 'bg-rose-500'
                                                : 'bg-purple-500'
                                            } w-fit py-1 px-4 text-white rounded-full`}
                                    >
                                        {transaction.type}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllTransactions;
