import React, { useState } from 'react';

const AddData = () => {
  const [selectedOption, setSelectedOption] = useState('income');

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
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
          {selectedOption === 'income' && (
            <>
              <input
                type="text"
                placeholder="Enter the source of income"
                className="bg-[#252839] rounded-md p-2"
              />
              <input
                type="number"
                placeholder="Enter the amount"
                className="bg-[#252839] rounded-md p-2"
              />
            </>
          )}
          {selectedOption === 'Expenses' && (
            <>
              <input
                type="text"
                placeholder="Enter the type of expenses"
                className="bg-[#252839] rounded-md p-2"
              />
              <input
                type="number"
                placeholder="Enter the amount"
                className="bg-[#252839] rounded-md p-2"
              />
            </>
          )}
          {selectedOption === 'stocks' && (
            <>
              <input
                type="text"
                placeholder="Enter the stock name"
                className="bg-[#252839] rounded-md p-2"
              />
              <input
                type="number"
                placeholder="Enter the quantity"
                className="bg-[#252839] rounded-md p-2"
              />
            </>
          )}
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
