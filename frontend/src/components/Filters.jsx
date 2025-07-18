import { TimeRangeEnum, TimeRangeOptionsEnum } from "../utils/enum";
import { useData } from "../contexts/DataContext";

const Filters = ({ filtersOpen, setFiltersOpen }) => {
  const {
    groupBy,
    setGroupBy,
    dateRange,
    setDateRange,
    customRange,
    setCustomRange,
    fetchTransections,
    setDataLoading,
  } = useData();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const isInvalidRange =
    dateRange === "Custom" &&
    new Date(customRange.startDate) > new Date(customRange.endDate);

  return (
    <div
      className="absolute top-[3.5rem] right-4 z-50 w-fit bg-slate-900/95 border border-blue-700/30 rounded-2xl shadow-2xl p-6 backdrop-blur-xl animate-fade-in"
      style={{ minWidth: 280 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-xl tracking-tight">
          Filters & Insights
        </h3>
      </div>

      <div className="space-y-7">
        {/* Group By Section */}
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
            Group Data By
          </label>
          <select
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={groupBy}
            onChange={(e) => {
              setGroupBy(e.target.value);
              setDataLoading(true);
            }}
          >
            {Object.values(TimeRangeEnum).map((range) => (
              <option key={range} value={range}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Section */}
        <div>
          <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
            Quick Date Range
          </label>
          <select
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setDataLoading(true);
            }}
          >
            {(TimeRangeOptionsEnum[groupBy] || []).map((days) => {
              const unit = groupBy.toLowerCase();
              const divisor =
                groupBy === TimeRangeEnum.Day
                  ? 1
                  : groupBy === TimeRangeEnum.Week
                  ? 7
                  : groupBy === TimeRangeEnum.Month
                  ? 30
                  : 365;

              const value = days / divisor;

              return (
                <option key={days} value={days.toString()}>
                  Last {value} {unit}
                  {value > 1 ? "s" : ""}
                </option>
              );
            })}

            <option value="Custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range Section */}
        {dateRange === "Custom" && (
          <div>
            <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">
              Custom Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={customRange.startDate}
                max={yesterday}
                onChange={(e) =>
                  setCustomRange({
                    ...customRange,
                    startDate: e.target.value,
                  })
                }
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
              <span className="text-gray-400 flex items-center">to</span>
              <input
                type="date"
                value={customRange.endDate}
                max={today}
                onChange={(e) =>
                  setCustomRange({
                    ...customRange,
                    endDate: e.target.value,
                  })
                }
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
            </div>
            {isInvalidRange && (
              <p className="text-red-400 text-sm mt-1">
                Start date cannot be after end date.
              </p>
            )}
          </div>
        )}

        {/* Apply Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={
              !isInvalidRange
                ? () => {
                    fetchTransections();
                    setFiltersOpen(false);
                  }
                : null
            }
            disabled={isInvalidRange}
            className={`px-4 py-2 rounded-lg w-full font-semibold transition-all ${
              isInvalidRange
                ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                : "bg-white text-black hover:bg-blue-100 cursor-pointer"
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
