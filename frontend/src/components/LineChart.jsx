// import { formartAmount } from "../utils/formatAmount";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const LineChart = ({data}) => {

//   return (
//     <ResponsiveContainer width="100%" height="100%">
//       <AreaChart data={data}>
//         <defs>
//           <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
//           </linearGradient>
//           <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
//           </linearGradient>
//         </defs>
//         {/* <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} /> */}
//         <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
//         <YAxis stroke="#9ca3af" fontSize={12} />
//         <Tooltip
//           contentStyle={{
//             backgroundColor: "rgba(30, 41, 59, 0.95)",
//             border: "1px solid rgba(255, 255, 255, 0.2)",
//             borderRadius: "12px",
//             color: "white",
//             boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
//           }}
//           labelStyle={{ color: "#9ca3af" }}
//           itemStyle={{ color: "#f3f4f6" }}
//           formatter={(value, name) => {
//             if (name === "income") {
//               return [`₹${formartAmount(value)}`, "Income"];
//             } else if (name === "expenses") {
//               return [`₹${formartAmount(value)}`, "Expenses"];
//             }
//             return [`₹${formartAmount(value)}`, name];
//           }}
//           labelFormatter={(label) => `Month: ${label}`}
//         />
//         <Area
//           type="monotone"
//           dataKey="income"
//           stroke="#10b981"
//           strokeWidth={2}
//           fill="url(#incomeGradient)"
//         />
//         <Area
//           type="monotone"
//           dataKey="expenses"
//           stroke="#ef4444"
//           strokeWidth={2}
//           fill="url(#expenseGradient)"
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default LineChart;

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// A robust function to format numbers as Indian Rupees (₹).
const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("₹", "₹ "); 
};

// A custom tooltip for a more polished look and feel.
const CustomTooltip = ({ active, payload, label, groupBy }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-800/90 backdrop-blur-sm shadow-xl rounded-xl border border-slate-700 text-sm">
        <p className="font-bold text-slate-300">{`${groupBy}: ${label}`}</p>
        <p className="text-emerald-400 mt-2">{`Income: ${formatAmount(
          payload[0].value
        )}`}</p>
        <p className="text-red-400">{`Expenses: ${formatAmount(
          payload[1].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

// This is the main chart component, now cleaner and more modular.
const LineChart = ({ data, groupBy }) => {
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 14,
          right: 10,
        }}
      >
        <defs>
          {/* Gradient for the Income area */}
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
          {/* Gradient for the Expense area */}
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* X-Axis Configuration with responsive label hiding */}
        <XAxis
          dataKey="month"
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd" // This automatically hides labels to prevent overlap
        />

        {/* Y-Axis Configuration */}
        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value / 1000}k`} // Format ticks to be more compact
        />

        {/* Grid lines for better readability */}
        <CartesianGrid strokeDasharray="3 3" stroke="#556276" opacity={0.5} />

        {/* Tooltip on hover */}
        <Tooltip content={<CustomTooltip groupBy={groupBy}/>} />

        {/* Legend to identify data series */}
        <Legend
          iconType="circle"
          iconSize={7}
          wrapperStyle={{
            paddingTop: "10px",
            color: "#f3f4f6",
            fontSize: "12px",
          }}
        />

        {/* Income Data Area with active dot and animation */}
        <Area
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={3}
          fill="url(#incomeGradient)"
          name="Income"
          activeDot={{ r: 5, stroke: "white", strokeWidth: 2 }}
          animationDuration={400}
        />

        {/* Expenses Data Area with active dot and animation */}
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={3}
          fill="url(#expenseGradient)"
          name="Expenses"
          activeDot={{ r: 5, stroke: "white", strokeWidth: 2 }}
          animationDuration={400}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
