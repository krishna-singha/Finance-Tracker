import { FaIndianRupeeSign } from "react-icons/fa6";

const TotalExpenses = () => {
    const totalExpenses = 1000;
    return (
        <div className="bg-[#181C3A] text-white p-6 rounded-2xl font-[500]">
            <h2 className="text-xl mb-4">Total Expenses</h2>
            <p className="text-[#09C9C8] text-2xl"><FaIndianRupeeSign className="inline-block" />{totalExpenses}</p>
            <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md text-[1.2rem]">Reset Expenses</button>
        </div>
    );
}

export default TotalExpenses;