import { FaIndianRupeeSign } from "react-icons/fa6";

const AvailableBalance = () => {
    const availableBalance = 10000.00;

    return (
        <div className="h-full bg-red text-white p-6 rounded-2xl font-[600]">
            <h2 className="font-[600] text-xl text-[1.5rem]">Available Balance</h2>
            <p className="text-[1.9rem]"><FaIndianRupeeSign className="inline-block" />{availableBalance}</p>
        </div>
    );
}

export default AvailableBalance;