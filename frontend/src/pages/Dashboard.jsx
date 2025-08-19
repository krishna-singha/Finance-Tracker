import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

import Trends from "../components/Trends";
import ExpenseCategory from "../components/ExpenseCategory";
import QuickAction from "../components/QuickAction";
import RecentTransactions from "../components/RecentTransections";

const Dashboard = () => {
  const { user } = useAuth();
  const { data } = useData();

  const totalIncome = data
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = data
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(amount);

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Here's an overview of your financial activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {[ 
            {
              label: "Current Balance",
              amount: balance,
              icon: <FaWallet />,
              color: balance >= 0 ? "green" : "red",
              subText: balance >= 0 ? "↗ Positive Balance" : "↘ Negative Balance",
            },
            {
              label: "Total Income",
              amount: totalIncome,
              icon: <FaArrowUp />,
              color: "green",
              subText: "↗ Monthly earnings",
            },
            {
              label: "Total Expenses",
              amount: totalExpenses,
              icon: <FaArrowDown />,
              color: "red",
              subText: "↘ Monthly spending",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className={`bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl border border-white/20 transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm uppercase tracking-wide font-medium">
                    {card.label}
                  </p>
                  <div className={`flex items-center gap-2 text-2xl sm:text-3xl font-bold mt-2 text-${card.color}-400`}>
                    <FaIndianRupeeSign className="text-lg sm:text-xl" />
                    {formatAmount(Math.abs(card.amount))}
                  </div>
                  <div className={`text-xs sm:text-sm mt-1 text-${card.color}-300`}>
                    {card.subText}
                  </div>
                </div>
                <div className={`p-3 sm:p-4 rounded-full bg-${card.color}-500/20 border-2 border-${card.color}-400/30`}>
                  {React.cloneElement(card.icon, { className: `text-${card.color}-400 text-2xl sm:text-3xl` })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 lg:h-[30rem]">
          <ExpenseCategory />
          <Trends />
        </div>

        {/* Actions & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
          <QuickAction />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
