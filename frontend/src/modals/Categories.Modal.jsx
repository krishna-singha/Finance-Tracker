import { useState, useMemo, useRef, useEffect } from "react";
import { useData } from "../contexts/DataContext";
import toast from "react-hot-toast";
import axios from "axios";
import { IoClose, IoTrashOutline, IoCreateOutline } from "react-icons/io5";
import { FaSave } from "react-icons/fa";

const CategoryModal = ({ onClose }) => {
  const { categories, fetchCategories } = useData();
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("expense");
  const [editing, setEditing] = useState(null);
  const [editInput, setEditInput] = useState("");
  const editInputRef = useRef(null);

  const filteredCategories = useMemo(() => {
    return categories
      .filter((c) => c.type === activeTab)
      .filter((c) => c.name.toLowerCase().includes(category.toLowerCase()));
  }, [categories, activeTab, category]);

  useEffect(() => {
    if (editing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editing]);

  const handleChange = (value) => {
    setCategory(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return;

    try {
      await axios.post("/api/v1/categories", {
        name: category.trim(),
        type: activeTab,
      });
      toast.success("Category saved!");
      setCategory("");
      fetchCategories();
    } catch {
      toast.error("Error saving category");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this category? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/api/v1/categories/${id}`);

      if (res.data.warn) {
        const confirmed = confirm(
          `${res.data.message} Do you want to delete this category and its ${res.data.count} transaction(s)?`
        );
        if (confirmed) {
          await axios.delete(`/api/v1/categories/${id}?force=true`);
          toast.success("Category and transactions deleted!");
          fetchCategories();
        }
      } else {
        toast.success("Category deleted!");
        fetchCategories();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEditClick = (cat) => {
    setEditing(cat._id);
    setEditInput(cat.name);
  };

  const handleSave = async (cat) => {
    if (!editInput.trim()) return toast.error("Name cannot be empty");
    try {
      await axios.put(`/api/v1/categories/${cat._id}`, {
        name: editInput.trim(),
        type: activeTab,
      });
      toast.success("Category updated!");
      setEditing(null);
      setEditInput("");
      fetchCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const resetForm = () => {
    setCategory("");
    setEditing(null);
    setEditInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="bg-gray-800 text-white w-full max-w-3xl h-[30rem] mx-auto p-6 rounded-2xl shadow-2xl space-y-6 relative flex flex-col">
        <button
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 rounded-full p-2 cursor-pointer"
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          <IoClose size={20} />
        </button>

        {/* Sub-navbar */}
        <div className="flex justify-center gap-4">
          {["expense", "income"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full font-medium cursor-pointer ${
                activeTab === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-500"
              }`}
              onClick={() => {
                setActiveTab(type);
                resetForm();
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Categories
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={category}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full bg-gray-700 p-3 rounded-xl"
              required
            />
            <button
              type="submit"
              disabled={!category.trim()}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 py-3 px-6 rounded-xl text-nowrap cursor-pointer disabled:opacity-50 transition-all`}
            >
              Add Category
            </button>
          </div>
        </form>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">
            No categories found for in {activeTab} type. Add a new
            one!
          </p>
        ) : (
          <div className="overflow-scroll flex-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 mt-4">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex justify-between items-center"
                >
                  {editing === cat._id ? (
                    <input
                      type="text"
                      ref={editInputRef}
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      className="bg-gray-600 rounded-lg text-white w-full mr-3 border border-gray-500 p-1 outline-none"
                    />
                  ) : (
                    <div className="text-lg font-medium text-white">
                      {cat.name}
                    </div>
                  )}

                  <div className="flex gap-2 ml-2">
                    {editing === cat._id ? (
                      <button onClick={() => handleSave(cat)}>
                        <FaSave className="text-green-400 cursor-pointer" />
                      </button>
                    ) : (
                      <button onClick={() => handleEditClick(cat)}>
                        <IoCreateOutline className="text-blue-400 cursor-pointer" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(cat._id)}>
                      <IoTrashOutline className="text-red-400 cursor-pointer" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;
