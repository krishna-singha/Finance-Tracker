import PieChartss from "../components/PieChart";
import { FaChartLine, FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";

import { useData } from "../contexts/DataContext";

const ExpenseCategory = () => {
  const { data, dataLoading, categories } = useData();
  const [expenses, setExpenses] = useState([]);

  

  useEffect(() => {
    if (!data || data.length === 0) {
      setExpenses([]);
      return;
    }

    const groupedByCategory = Object.values(
      data.reduce((acc, transaction) => {
        if (transaction.type !== "expense") return acc;

        const category = transaction.categoryId.name || "Uncategorized";

        if (!acc[category]) {
          acc[category] = {
            name: category,
            value: 0,
          };
        }

        acc[category].value += transaction.amount;
        return acc;
      }, {})
    );

    setExpenses(groupedByCategory);
  }, [data]);

  return (
    <div className="flex flex-col bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-white">Expense Categories</h2>
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30">
          <FaChartLine className="text-purple-400" />
        </div>
      </div>
      {dataLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400">Loading Expense...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <div className="h-[22rem]">
          <PieChartss expenses={expenses} />
        </div>
      ) : (
        <div className="flex-1 h-64 flex flex-col items-center justify-center text-gray-400">
          <div className="p-4 rounded-full bg-gray-500/20 mb-4">
            <FaChartLine className="text-3xl" />
          </div>
          <p className="text-lg font-medium">No expense data available</p>
          <p className="text-sm">Add transactions to see expenses</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;
