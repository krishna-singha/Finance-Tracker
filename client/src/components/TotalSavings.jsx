import { FaIndianRupeeSign } from "react-icons/fa6";

const TotalSavings = () => {

    const totalSavings = 1000;

    return (
        <div className="bg-[#181C3A] text-white p-6 rounded-2xl font-[500]">
            <h2 className="text-xl mb-4">Total Savings</h2>
            <p className="text-[#09C9C8] text-2xl"><FaIndianRupeeSign className="inline-block" />{totalSavings}</p>
            <button className="bg-blue-600 text-white w-full py-2 mt-6 rounded-md text-[1.2rem]">Add Savings</button>
        </div>
    );
}

export default TotalSavings;