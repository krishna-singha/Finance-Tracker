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

  // Calculate stats based on category type
  const totalIncome = data
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = data
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(amount);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-gray-300">
              Here's an overview of your financial activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">
                  Current Balance
                </p>
                <div
                  className={`flex items-center gap-2 text-3xl font-bold mt-2 ${
                    balance >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <FaIndianRupeeSign className="text-xl" />
                  {formatAmount(Math.abs(balance))}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    balance >= 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {balance >= 0 ? "↗ Positive Balance" : "↘ Negative Balance"}
                </div>
              </div>
              <div
                className={`p-4 rounded-full ${
                  balance >= 0 ? "bg-green-500/20" : "bg-red-500/20"
                } border-2 ${
                  balance >= 0 ? "border-green-400/30" : "border-red-400/30"
                }`}
              >
                <FaWallet
                  className={`text-3xl ${
                    balance >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">
                  Total Income
                </p>
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

          <div className="bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm uppercase tracking-wide font-medium">
                  Total Expenses
                </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 h-[30rem]">
          <ExpenseCategory />
          <Trends />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <QuickAction />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
