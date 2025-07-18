import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { FaSpinner } from "react-icons/fa";

const RecentTransactions = () => {
  const { data, dataLoading } = useData();

  return (
    <div className="flex flex-col h-[35rem] w-full lg:col-span-2 bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
            <FaArrowUp className="text-indigo-400" />
          </div>
          Recent 10 Transactions
        </h2>
        <Link
          to="/all-transactions"
          className="text-purple-400 hover:text-purple-300 text-sm transition-colors font-medium px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30"
        >
          View All
        </Link>
      </div>
      {dataLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400">Loading transections...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
          <div className="p-6 rounded-full bg-gray-500/20 mb-6 mx-auto w-fit">
            <FaWallet className="text-4xl text-gray-400" />
          </div>
          <p className="text-gray-300 text-lg font-medium mb-2">
            No transactions data available
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Start by adding your income or expense
          </p>
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
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-4">
          {data.slice(0, 10).map((transaction, index) => (
            <div
              key={index}
              className="cursor-pointer flex items-center justify-between gap-12 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    transaction.type === "income"
                      ? "bg-green-500/20 border border-green-400/30"
                      : "bg-red-500/20 border border-red-400/30"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <FaArrowUp className="text-green-400" />
                  ) : (
                    <FaArrowDown className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-lg">
                    {transaction.categoryId.name || "Uncategorized"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-300 text-sm bg-gray-500/20 px-2 py-1 rounded-lg">
                      {transaction.note || "No description"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`flex items-center justify-end gap-2 font-bold text-xl ${
                    transaction.type === "income"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  <FaIndianRupeeSign className="text-base" />
                  {new Intl.NumberFormat("en-IN").format(transaction.amount)}
                </div>
                <p className="text-gray-400 text-sm mt-1 bg-gray-500/20 px-2 py-1 rounded-lg inline-block text-nowrap">
                  {new Date(transaction.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
