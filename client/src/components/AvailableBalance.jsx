import { FaIndianRupeeSign } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { incomeAtom } from "../store/incomeAtom";
import { expenseAtom } from "../store/expenseAtom";

const AvailableBalance = () => {
    
    const incomes = useRecoilValue(incomeAtom);
    const expenses = useRecoilValue(expenseAtom);
    
    const totalIncome = incomes.reduce((acc, { amount }) => acc + amount, 0);
    const totalExpense = expenses.reduce((acc, { amount }) => acc + amount, 0);
    
    const availableBalance = totalIncome - totalExpense;

    return (
        <div className="h-full bg-red text-white p-6 rounded-2xl font-[600]">
            <h2 className="font-[600] text-xl text-[1.5rem]">Available Balance</h2>
            <p className="text-[1.9rem]"><FaIndianRupeeSign className="inline-block" />{availableBalance}</p>
        </div>
    );
}

export default AvailableBalance;