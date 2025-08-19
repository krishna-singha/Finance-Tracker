import { FaWallet, FaArrowUp, FaArrowDown, FaSpinner } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";

const RecentTransactions = () => {
  const { data, dataLoading } = useData();

  return (
    <div className="flex flex-col h-full w-full lg:col-span-2 bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl border border-white/20 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30">
            <FaArrowUp className="text-indigo-400 text-sm sm:text-lg" />
          </div>
          Recent 10 Transactions
        </h2>
        <Link
          to="/all-transactions"
          className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors font-medium px-3 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30"
        >
          View All
        </Link>
      </div>

      {/* Loading */}
      {dataLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[16rem] sm:min-h-[24rem]">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-2xl sm:text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">
              Loading transactions...
            </p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center px-4">
          <div className="p-6 rounded-full bg-gray-500/20 mb-6 mx-auto w-fit">
            <FaWallet className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <p className="text-gray-300 text-lg sm:text-xl font-medium mb-2">
            No transactions data available
          </p>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Start by adding your income or expense
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/incomes"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
            >
              Add Income
            </Link>
            <Link
              to="/expenses"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base transition-colors"
            >
              Add Expense
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-2 sm:px-4">
          {data.slice(0, 10).map((transaction, index) => (
            <div
              key={index}
              className="cursor-pointer flex flex-row items-center justify-between gap-3 sm:gap-12 p-3 sm:p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-[1.02]"
            >
              {/* Left side: icon + text */}
              <div className="flex items-center gap-3 sm:gap-4 w-full min-w-0">
                <div
                  className={`p-3 rounded-xl flex-shrink-0 ${
                    transaction.type === "income"
                      ? "bg-green-500/20 border border-green-400/30"
                      : "bg-red-500/20 border border-red-400/30"
                  }`}
                >
                  {transaction.type === "income" ? (
                    <FaArrowUp className="text-green-400 text-base sm:text-lg" />
                  ) : (
                    <FaArrowDown className="text-red-400 text-base sm:text-lg" />
                  )}
                </div>

                {/* Text container */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                  <p className="text-white font-medium text-sm sm:text-lg truncate">
                    {transaction.categoryId?.name || "Uncategorized"}
                  </p>
                  <span className="text-gray-300 text-xs sm:text-sm bg-gray-500/20 px-2 py-1 rounded-lg truncate mt-1 block overflow-hidden">
                    {transaction.note || "No description"}
                  </span>
                </div>
              </div>

              {/* Right side: amount + date */}
              <div className="flex flex-col items-end flex-shrink-0 min-w-0">
                <div
                  className={`flex items-center justify-end gap-1 font-bold text-base sm:text-xl text-right truncate min-w-0 
                ${
                  transaction.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
                >
                  <FaIndianRupeeSign className="text-sm sm:text-base flex-shrink-0" />
                  <span className="truncate">
                    {new Intl.NumberFormat("en-IN").format(transaction.amount)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-1 bg-gray-500/20 px-2 py-1 rounded-lg inline-block truncate">
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
