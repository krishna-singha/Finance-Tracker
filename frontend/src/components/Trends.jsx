import { useData } from "../contexts/DataContext";
import LineChart from "./LineChart";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";

const Trends = () => {
  const { transactions, groupBy, dataLoading } = useData();

  const formatDate = (date) => {
    if (groupBy === "Day" || groupBy === "Week") {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
    } else if (groupBy === "Month") {
      return new Date(date).toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
    } else {
      return new Date(date).getFullYear().toString();
    }
  };

  const data = transactions
    .reduce((acc, t) => {
      const date = new Date(t.date);
      const formattedDate = formatDate(t.date);
      const existing = acc.find((item) => item.month === formattedDate);
      if (existing) {
        if (t.type === "income") existing.income += t.amount;
        else existing.expenses += t.amount;
      } else {
        acc.push({
          month: formattedDate,
          income: t.type === "income" ? t.amount : 0,
          expenses: t.type === "expense" ? t.amount : 0,
          sortDate: date,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.sortDate - b.sortDate);

  return (
    <div className="flex flex-col bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-xl rounded-xl p-6 shadow-xl border border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">{groupBy} Trends</h2>
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
          <FaArrowUp className="text-blue-400" />
        </div>
      </div>
      {dataLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400">Loading trends...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <div className="h-[20rem] flex-1 flex justify-center items-center">
          <LineChart data={data} groupBy={groupBy} />
        </div>
      ) : (
        <div className="flex-1 h-64 flex flex-col items-center justify-center text-gray-400">
          <div className="p-4 rounded-full bg-gray-500/20 mb-4">
            <FaArrowUp className="text-3xl" />
          </div>
          <p className="text-lg font-medium">No trend data available</p>
          <p className="text-sm">Add transactions to see {groupBy} trends</p>
        </div>
      )}
    </div>
  );
};

export default Trends;
