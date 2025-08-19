import { useData } from "../contexts/DataContext";
import LineChart from "./LineChart";
import { FaArrowUp, FaSpinner } from "react-icons/fa";

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
    <div className="flex flex-col bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 shadow-xl border border-white/20 transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {groupBy} Trends
        </h2>
        <div className="p-2 sm:p-2.5 rounded-lg bg-blue-500/20 border border-blue-400/30">
          <FaArrowUp className="text-blue-400 text-lg sm:text-xl" />
        </div>
      </div>

      {/* Loading */}
      {dataLoading ? (
        <div className="flex items-center justify-center flex-1 min-h-[16rem] sm:min-h-[20rem]">
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-2xl sm:text-3xl text-blue-400 mb-4" />
            <p className="text-gray-400 text-sm sm:text-base">Loading trends...</p>
          </div>
        </div>
      ) : data.length > 0 ? (
        <div className="flex-1 h-[18rem] sm:h-[20rem] w-full flex justify-center items-center">
          <LineChart data={data} groupBy={groupBy} />
        </div>
      ) : (
        <div className="flex-1 min-h-[16rem] sm:min-h-[20rem] flex flex-col items-center justify-center text-gray-400 text-center px-4">
          <div className="p-4 rounded-full bg-gray-500/20 mb-4">
            <FaArrowUp className="text-3xl sm:text-4xl" />
          </div>
          <p className="text-lg sm:text-xl font-medium mb-1">No trend data available</p>
          <p className="text-sm sm:text-base">
            Add transactions to see {groupBy} trends
          </p>
        </div>
      )}
    </div>
  );
};

export default Trends;
