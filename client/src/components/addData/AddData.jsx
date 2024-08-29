import { useState } from 'react';

const AddData = () => {
  const [selectedOption, setSelectedOption] = useState('income');

  const handleSelectChange = (e) => setSelectedOption(e.target.value);

  // Common input styles
  const inputStyle = "bg-[#252839] rounded-md p-2";

  const renderInputs = () => {
    switch (selectedOption) {
      case 'income':
        return (
          <>
            <input
              type="text"
              placeholder="Enter the source of income"
              className={inputStyle}
            />
            <input
              type="number"
              placeholder="Enter the amount"
              className={inputStyle}
            />
            <input
              type="date"
              className={inputStyle}
            />
          </>
        );
      case 'Expenses':
        return (
          <>
            <input
              type="text"
              placeholder="Enter the type of expenses"
              className={inputStyle}
            />
            <input
              type="number"
              placeholder="Enter the amount"
              className={inputStyle}
            />
            <input
              type="date"
              className={inputStyle}
            />
          </>
        );
      case 'stocks':
        return (
          <>
            <input
              type="text"
              placeholder="Enter the stock name"
              className={inputStyle}
            />
            <input
              type="number"
              placeholder="Enter the quantity"
              className={inputStyle}
            />
            <input
              type="date"
              className={inputStyle}
            />
          </>
        );
      default:
        return null;
    }
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
          <option value="income">Income</option>
          <option value="Expenses">Expenses</option>
          <option value="stocks">Stocks</option>
        </select>
      </div>
      <form>
        <div className="flex flex-col gap-6 w-full mt-6">
          {renderInputs()}
        </div>
        <div className="w-full mt-4">
          <button className="bg-[#3B82F6] text-white px-4 py-2 rounded-md w-full">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddData;
