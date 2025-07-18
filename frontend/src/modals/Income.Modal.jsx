import { useState } from "react";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";
import {
  IoClose
} from "react-icons/io5";

import axios from "axios";

const initialForm = () => ({
  category: "",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

const IncomeModal = ({ onClose, editing }) => {
  const { categories, fetchTransections, } = useData();
  const [formData, setFormData] = useState(editing ? {
    category: editing.categoryId?._id || "",
    amount: editing.amount,
    description: editing.note || "",
    date: new Date(editing.date).toISOString().split("T")[0],
  } : initialForm());

  const handleInputChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, amount, description, date } = formData;

    if (!category || !amount) {
      toast.error("Category and amount are required");
      return;
    }

    const payload = {
      categoryId: category,
      amount: parseFloat(amount),
      note: description,
      type: "income",
      date,
    };

    try {
      const url = editing
        ? `/api/v1/transactions/${editing._id}`
        : "/api/v1/transactions";
      const method = editing ? axios.put : axios.post;

      const res = await method(url, payload);

      toast.success(editing ? "Income updated!" : "Income added!");
      fetchTransections();
      setFormData(initialForm());
      onClose();
    } catch {
      toast.error("Failed to save Income");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="bg-gray-800 text-white mx-auto p-6 rounded-2xl shadow-2xl space-y-6 relative flex flex-col">
        <button
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
          onClick={() => {
            setFormData(initialForm());
            onClose();
          }}
        >
          <IoClose size={20} />
        </button>

        <form
          onSubmit={handleSubmit}
          className="p-2 rounded-xl w-full max-w-md space-y-4"
        >
          <h2 className="text-xl font-bold">
            {editing ? "Edit" : "Add"} Income
          </h2>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full bg-gray-700 p-2 rounded-xl"
            required
          >
            <option value="">Select Category</option>
            {categories &&
              categories
                .filter((c) => c.type === "income")
                .map((c, i) => (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            max={1000000}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full bg-gray-700 p-2 rounded-xl"
            required
          />
          <input
            type="date"
            value={formData.date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full bg-gray-700 p-2 rounded-xl"
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            maxLength={200}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full bg-gray-700 p-2 rounded-xl resize-none"
          />
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 p-2 rounded-xl cursor-pointer"
            >
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeModal;
