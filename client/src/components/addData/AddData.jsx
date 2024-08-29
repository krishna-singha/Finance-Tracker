import { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../store/userAtom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddData = () => {
  const user = useRecoilValue(userAtom);

  const [selectedOption, setSelectedOption] = useState('income');
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectChange = (e) => setSelectedOption(e.target.value);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddData = async (e) => {
    e.preventDefault();
    if(!formData.source || !formData.amount || !formData.date) {
      return setError('All fields are required');
    }
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${BACKEND_URL}/v1/api/addData/${selectedOption}`, {
        "_id": user.uid,
        [selectedOption]: {
          [selectedOption == "income" ? "source"
            : selectedOption == "expense" ? "type"
              : "name"]: formData.source,
          "amount": formData.amount,
          "date": formData.date,
        }
      });

      setFormData({
        source: '',
        amount: '',
        date: '',
      });
    } catch (err) {
      setError('Failed to add data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => {
    const inputProps = {
      className: "bg-[#252839] rounded-md p-2",
      onChange: handleInputChange,
    };

    return (
      <>
        <input
          type="text"
          name="source"
          placeholder={`Enter the ${selectedOption === 'stock' ? 'stock name' : selectedOption === 'expense' ? 'type of expense' : 'source of income'}`}
          value={formData.source}
          {...inputProps}
        />
        <input
          type="number"
          name="amount"
          placeholder="Enter the amount"
          value={formData.amount}
          {...inputProps}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          {...inputProps}
        />
      </>
    );
  };

  return (
    <div className="bg-[#181C3A] text-white rounded-xl p-6 w-[23rem]">
      <div className="flex justify-center gap-2">
        <h1>Add</h1>
        <select
          name="sort"
          id="sort"
          className="bg-[#181C3A]"
          value={selectedOption}
          onChange={handleSelectChange}
        >
          <option value="income">Incomes</option>
          <option value="expense">Expenses</option>
          <option value="stock">Stocks</option>
        </select>
      </div>
      <form onSubmit={handleAddData}>
        <div className="flex flex-col gap-6 w-full mt-6">
          {renderInputs()}
        </div>
        <div className="w-full mt-4">
          <button type="submit" className="bg-[#3B82F6] text-white px-4 py-2 rounded-md w-full" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default AddData;
