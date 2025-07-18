export const TimeRangeEnum = {
  Day: "Day",
  Week: "Week",
  Month: "Month",
  Year: "Year",
};

export const TimeRangeOptionsEnum = {
  Day: [7, 14, 30],
  Week: [28, 56, 84],       // 4, 8, 12 weeks
  Month: [180, 360, 540],   // 6, 12, 18 months (approx days)
  Year: [1095, 1825, 3650]  // 3, 5, 10 years (approx days)
};