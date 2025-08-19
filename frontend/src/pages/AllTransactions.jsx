import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import ExpenseModal from "../modals/Expense.Modal";
import IncomeModal from "../modals/Income.Modal";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";

const AllTransactions = () => {
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState("");
  const [editing, setEditing] = useState(null);

  const { data, fetchTransections } = useData();

  useEffect(() => {
    let result = [...data];

    if (search)
      result = result.filter(
        (t) =>
          t.note?.toLowerCase().includes(search.toLowerCase()) ||
          t.categoryId?.name?.toLowerCase().includes(search.toLowerCase())
      );

    if (type !== "all") result = result.filter((t) => t.type === type);

    result.sort((a, b) => {
      const aVal = sortBy === "amount" ? a.amount : new Date(a.date);
      const bVal = sortBy === "amount" ? b.amount : new Date(b.date);
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    setFiltered(result);
  }, [data, search, type, sortBy, sortOrder]);

  const formatAmount = (amt) => new Intl.NumberFormat("en-IN").format(amt);
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const downloadCSV = () => {
    if (!filtered.length) return;

    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map((t) => [
      formatDate(t.date),
      t.note || "No description",
      t.categoryId?.name || "Uncategorized",
      t.type,
      t.amount,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
  };

  const handleEdit = (transaction) => {
    setEditing(transaction);
    setShowModal(transaction.type === "income" ? "income" : "expense");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;
    try {
      await axios.delete(`/api/v1/transactions/${id}`);
      toast.success("Transaction deleted successfully");
      setFiltered((prev) => prev.filter((t) => t._id !== id));
      fetchTransections();
    } catch (error) {
      toast.error("Failed to delete transaction");
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-7xl w-full mx-auto flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-md">
              Manage and view all your financial transactions in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => setShowModal("income")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow text-sm sm:text-base whitespace-nowrap"
            >
              + Add Income
            </button>

            <button
              onClick={() => setShowModal("expense")}
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow text-sm sm:text-base whitespace-nowrap"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {[
            {
              label: "Total Transactions",
              value: data.length,
              color: "text-white",
            },
            {
              label: "Total Income",
              value: data
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0),
              color: "text-green-400",
              icon: <FaIndianRupeeSign className="text-base sm:text-lg" />,
            },
            {
              label: "Total Expenses",
              value: data
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0),
              color: "text-red-400",
              icon: <FaIndianRupeeSign className="text-base sm:text-lg" />,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/50 hover:bg-slate-900/70 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl border border-white/20 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {card.label}
                </p>
                <p className={`text-lg sm:text-2xl font-bold ${card.color} flex items-center gap-1 truncate`}>
                  {card.icon}
                  {card.icon ? formatAmount(card.value) : card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 sm:py-2 bg-slate-900/50 border border-white/15 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-900/50 border border-white/15 text-white text-sm sm:text-base px-3 py-2 rounded-lg cursor-pointer"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900/50 border border-white/15 text-white text-sm sm:text-base px-3 py-2 rounded-lg cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="mt-6 sm:mt-0 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm sm:text-base transition"
          >
            {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
            <span className="">
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </span>
          </button>

          <button
            onClick={downloadCSV}
            className="mb-6 sm:mb-0 bg-green-600 hover:bg-green-700 px-2 sm:px-4 py-2 rounded-lg text-sm sm:text-base cursor-pointer whitespace-nowrap"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900/60 border border-white/10 rounded-lg shadow overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No transactions found.
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-x-auto overflow-y-auto">
              <table className="w-full text-sm table-auto min-w-[600px]">
                <thead className="sticky top-0 z-10 bg-slate-900 text-purple-300 text-xs sm:text-sm uppercase tracking-wide border-b border-white/10">
                  <tr>
                    <th className="p-2 sm:p-3 text-left">Date</th>
                    <th className="p-2 sm:p-3 text-left">Description</th>
                    <th className="p-2 sm:p-3">Category</th>
                    <th className="p-2 sm:p-3">Type</th>
                    <th className="p-2 sm:p-3 text-right">Amount</th>
                    <th className="p-2 sm:p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr
                      key={t._id}
                      className={`border-t border-white/5 ${
                        i % 2 === 0 ? "bg-white/5" : ""
                      } hover:bg-white/10`}
                    >
                      <td className="p-2 sm:p-3 whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td
                        className={`p-2 sm:p-3 truncate ${
                          !t.note && "text-gray-500"
                        }`}
                      >
                        {t.note || "No description"}
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="text-xs sm:text-sm bg-purple-600/70 w-fit mx-auto px-2 py-1 rounded-full text-purple-100 capitalize truncate">
                          {t.categoryId?.name || "Uncategorized"}
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 capitalize">
                        <div
                          className={`text-xs sm:text-sm px-2 py-1 w-fit mx-auto rounded-full ${
                            t.type === "income"
                              ? "bg-green-600 text-green-100"
                              : "bg-red-600 text-red-100"
                          }`}
                        >
                          {t.type}
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-right font-semibold">
                        <div
                          className={`flex justify-end items-center gap-1 ${
                            t.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <FaIndianRupeeSign className="text-xs sm:text-sm" />
                          {formatAmount(t.amount)}
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 flex gap-2 justify-center">
                        <button onClick={() => handleEdit(t)}>
                          <IoCreateOutline className="text-blue-400 cursor-pointer text-lg" />
                        </button>
                        <button onClick={() => handleDelete(t._id)}>
                          <IoTrashOutline className="text-red-400 cursor-pointer text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showModal === "expense" && (
        <ExpenseModal
          onClose={() => {
            setShowModal("");
            setEditing(null);
          }}
          editing={editing}
        />
      )}
      {showModal === "income" && (
        <IncomeModal
          onClose={() => {
            setShowModal("");
            setEditing(null);
          }}
          editing={editing}
        />
      )}
    </div>
  );
};

export default AllTransactions;
