import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { TimeRangeEnum, TimeRangeOptionsEnum } from "../utils/enum";
import axios from "axios";
import toast from "react-hot-toast";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [groupBy, setGroupBy] = useState(TimeRangeEnum.Month);
  const [dateRange, setDateRange] = useState(
    TimeRangeOptionsEnum[TimeRangeEnum.Month][0].toString()
  );

  const [customRange, setCustomRange] = useState({
    startDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  const getPastDate = (daysAgo) =>
    new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10);

  // Sync dateRange with groupBy
  useEffect(() => {
    const defaultRange = TimeRangeOptionsEnum[groupBy]?.[0];
    if (defaultRange && dateRange !== defaultRange.toString()) {
      setDateRange(defaultRange.toString());
    }
  }, [groupBy]);

  // Update customRange based on groupBy + dateRange
  useEffect(() => {
    if (dateRange === "Custom") return;
    const days = Number(dateRange);
    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = getPastDate(days);
    setCustomRange({ startDate, endDate });
  }, [dateRange, groupBy]);

  // Fetch categories once when authenticated
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`/api/v1/categories`);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to load categories");
    }
  };

  // Fetch transactions based on current custom range
  const fetchTransections = async () => {
    if (!user) return;
    try {
      setDataLoading(true);
      const { startDate, endDate } = customRange;
      const res = await axios.get("/api/v1/transactions", {
        params: { startDate, endDate },
      });
      setData(res.data.transactions || []);
    } catch (err) {
      console.error("Fetch transactions error:", err);
      toast.error("Failed to load transactions");
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch goals when user logs in
  const fetchGoals = async () => {
    try {
      const response = await axios.get("/api/v1/goals");
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    }
  };

  // Fetch budgets when user logs in
  const fetchBudgets = async () => {
    try {
      const response = await axios.get("/api/v1/budgets");
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets");
    }
  };

  // Fetch when user logs in
  useEffect(() => {
    if (user) {
      fetchTransections();
      fetchCategories();
      fetchGoals();
      fetchBudgets();
    }
  }, [user]);

  // Grouping logic
  useEffect(() => {
    if (!data || data.length === 0) {
      setTransactions([]);
      return;
    }

    const grouped = Object.values(
      data.reduce((acc, tx) => {
        const dateObj = new Date(tx.date);
        let dateKey;

        switch (groupBy) {
          case TimeRangeEnum.Day:
            dateKey = dateObj.toISOString().slice(0, 10);
            break;
          case TimeRangeEnum.Week: {
            const weekStart = new Date(dateObj);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            dateKey = weekStart.toISOString().slice(0, 10);
            break;
          }
          case TimeRangeEnum.Month:
            dateKey = `${dateObj.getFullYear()}-${String(
              dateObj.getMonth() + 1
            ).padStart(2, "0")}`;
            break;
          case TimeRangeEnum.Year:
            dateKey = dateObj.getFullYear().toString();
            break;
          default:
            dateKey = "Unknown";
        }

        const key = `${dateKey}-${tx.type}`;
        if (!acc[key]) {
          acc[key] = {
            date: dateKey,
            type: tx.type,
            amount: 0,
          };
        }
        acc[key].amount += tx.amount;
        return acc;
      }, {})
    );

    setTransactions(grouped);
  }, [data, groupBy]);

  const contextValue = useMemo(
    () => ({
      data,
      setData,
      categories,
      setCategories,
      fetchCategories,
      transactions,
      dataLoading,
      setDataLoading,
      fetchTransections,
      groupBy,
      setGroupBy,
      dateRange,
      setDateRange,
      customRange,
      setCustomRange,
      goals,
      fetchGoals,
      budgets,
      fetchBudgets,
    }),
    [
      data,
      categories,
      transactions,
      dataLoading,
      groupBy,
      dateRange,
      customRange,
      goals,
      budgets,
    ]
  );

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};
