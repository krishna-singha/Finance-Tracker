import PieChartss from "../components/PieChart";
import { FaChartLine, FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";

const ExpenseCategory = () => {
  const { data, dataLoading } = useData();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setExpenses([]);
      return;
    }

    const groupedByCategory = Object.values(
      data.reduce((acc, transaction) => {
        if (transaction.type !== "expense") return acc;

        const category = transaction.categoryId?.name || "Uncategorized";

        if (!acc[category]) {
          acc[category] = { name: category, value: 0 };
        }

        acc[category].value += transaction.amount;
        return acc;
      }, {})
    );

    setExpenses(groupedByCategory);
  }, [data]);

  return (
    <div className="flex flex-col bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl border border-white/20 transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Expense Categories
        </h2>
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
          <FaChartLine className="text-purple-400 text-lg sm:text-xl" />
        </div>
      </div>

      {/* Loading */}
      {dataLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[16rem] sm:min-h-[22rem]">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-2xl sm:text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">Loading Expense...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <div className="h-64 sm:h-[22rem] w-full">
          <PieChartss expenses={expenses} />
        </div>
      ) : (
        <div className="flex-1 min-h-[16rem] sm:min-h-[22rem] flex flex-col items-center justify-center text-gray-400 text-center px-4">
          <div className="p-4 rounded-full bg-gray-500/20 mb-4">
            <FaChartLine className="text-3xl sm:text-4xl" />
          </div>
          <p className="text-lg sm:text-xl font-medium mb-1">No expense data available</p>
          <p className="text-sm sm:text-base">Add transactions to see expenses</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
