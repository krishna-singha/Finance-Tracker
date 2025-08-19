import React, { useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import { COLORS } from "../constants/colors";
import { formartAmount } from "../utils/formatAmount";

// Split category name into multiple lines if needed
const splitCategoryName = (name) => name.split(" ");

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      {/* Center category label */}
      <text
        x={cx}
        y={cy - (splitCategoryName(payload.name).length - 1) * 8}
        textAnchor="middle"
        fill={fill}
        fontSize={10}
        fontWeight="600"
      >
        {splitCategoryName(payload.name).map((line, i) => (
          <tspan x={cx} dy={i === 0 ? 0 : 14} key={i}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Slice highlight */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Connector line and value */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#ffffff"
        fontSize={10}
      >
        {`₹ ${formartAmount(value)}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={14}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={10}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const PieChartss = ({ expenses }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={expenses}
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="50%"
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={handleMouseEnter}
        >
          {expenses.map((entry, index) => (
            <Cell key={`slice-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartss;
