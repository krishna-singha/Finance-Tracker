import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { FaBullseye, FaWallet, FaThLarge } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";
import axios from "axios";
import CategoriesModal from "../modals/Categories.Modal";
import ExpenseModal from "../modals/Expense.Modal";
import IncomeModal from "../modals/Income.Modal";
import BudgetModal from "../modals/Budget.Modal";
import GoalModal from "../modals/Goal.Modal";

const initialForm = () => ({
  categoryId: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const QuickAction = () => {
  const { fetchTransections, categories } = useData();

  const [formData, setFormData] = useState(initialForm());
  const [showModal, setShowModal] = useState("");
  const [editing, setEditing] = useState(null);

  const handleInputChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setFormData(initialForm());
    setEditing(null);
    setShowModal("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { categoryId, amount, description, date } = formData;
    if (!categoryId || !amount) return toast.error("All fields are required");

    const payload = {
      categoryId,
      amount: parseFloat(amount),
      note: description,
      type: "expense",
      date,
    };

    try {
      const url = editing
        ? `/api/v1/transactions/${editing._id}`
        : "/api/v1/transactions";
      const method = editing ? axios.put : axios.post;

      await method(url, payload);
      toast.success(editing ? "Expense updated!" : "Expense added!");
      fetchTransections();
      resetForm();
    } catch {
      toast.error("Failed to save expense");
    }
  };

  return (
    <>
      <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 text-white w-full max-w-md mx-auto transition-all duration-300 hover:scale-[1.01]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-wide">Quick Action</h2>
          <span className="text-xs px-2 py-1 bg-white/20 rounded-md text-gray-200 uppercase tracking-widest">
            Finance Actions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["expense", "income", "budget", "goal", "categories"].map((key, i) => (
            <button
              key={key}
              onClick={() => setShowModal(key)}
              className={`last:col-span-2 cursor-pointer flex flex-col items-center justify-center gap-2 p-5 rounded-xl shadow-md transition-all min-h-[120px] text-center 
                ${key === "expense" ? "bg-red-500/80 hover:bg-red-600" : ""}
                ${key === "income" ? "bg-green-500/80 hover:bg-green-600" : ""}
                ${key === "budget" ? "bg-yellow-500/80 hover:bg-yellow-600" : ""}
                ${key === "goal" ? "bg-purple-500/80 hover:bg-purple-600" : ""}
                ${key === "categories" ? "bg-blue-500/80 hover:bg-blue-600" : ""}`}
            >
              {key === "expense" && <IoRemoveCircleOutline size={28} />}
              {key === "income" && <IoAddCircleOutline size={28} />}
              {key === "budget" && <FaWallet size={24} />}
              {key === "goal" && <FaBullseye size={24} />}
              {key === "categories" && <FaThLarge size={24} />}
              <span className="text-sm font-medium">Add {key}</span>
            </button>
          ))}
        </div>
      </div>
      {showModal === "expense" && (
        <ExpenseModal
          onClose={() => setShowModal("")}
          editing={null}
          />
      )}
      {showModal === "income" && (
        <IncomeModal
          onClose={() => setShowModal("")}
          editing={null}
        />
      )}
      {showModal === "budget" && (
        <BudgetModal
          onClose={() => setShowModal("")}
          editing={null}
        />
      )}
      {showModal === "goal" && (
        <GoalModal
          onClose={() => setShowModal("")}
          editing={null}
        />
      )}
      {showModal === "categories" && (
        <CategoriesModal
          onClose={() => setShowModal("")}
          editing={null}
        />
      )}
    </>
  );
};

export default QuickAction;
