import { useState } from 'react';
import { FaIndianRupeeSign } from "react-icons/fa6";

const AllTransactions = () => {
    const transactions = [
        { date: '2021-09-01', source: 'Scholarship', amount: 1000, type: 'Income' },
        { date: '2021-09-02', source: 'Freelance', amount: 2000, type: 'Income' },
        { date: '2021-09-03', source: 'Part-time', amount: 3000, type: 'Income' },
        { date: '2021-09-04', source: 'Full-time', amount: 4000, type: 'Income' },
        { date: '2021-09-05', source: 'Internship', amount: 5000, type: 'Income' },
        { date: '2021-09-06', source: 'Shopping', amount: -1500, type: 'Expense' },
        { date: '2021-09-07', source: 'Rent', amount: -2500, type: 'Expense' },
        { date: '2021-09-08', source: 'Groceries', amount: -1800, type: 'Expense' },
        { date: '2021-09-09', source: 'Stock Investment', amount: 5000, type: 'Stock' },
        { date: '2021-09-10', source: 'Dividend', amount: 2000, type: 'Income' },
    ];

    const [filter, setFilter] = useState('All');

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'All') return true;
        return transaction.type === filter;
    });

    return (
        <div className="text-white bg-primary max-w-[1550px] mx-auto min-h-screen my-4 rounded-xl py-6 px-8">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-[#09C9C8]">Transactions</h1>
                <div className="flex gap-4">
                    {['All', 'Income', 'Expense', 'Stock'].map(category => (
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
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Type</th>
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
                                <td className="px-6 py-4 max-w-[40%]">{transaction.source}</td>
                                <td className={`px-6 py-4 ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {transaction.amount < 0 ? '-' : ''}
                                    <FaIndianRupeeSign className='inline-block' />
                                    {Math.abs(transaction.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    <div
                                        className={`${transaction.type === 'Income'
                                                ? 'bg-teal-500'
                                                : transaction.type === 'Expense'
                                                    ? 'bg-rose-500'
                                                    : 'bg-purple-500'
                                            } w-fit py-1 px-4 text-white  rounded-full`}
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