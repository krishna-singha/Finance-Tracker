import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { FaBagShopping, FaIndianRupeeSign } from "react-icons/fa6";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../store/userAtom';

const TopThreeStocks = () => {
    const user = useRecoilValue(userAtom);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        const getStocks = async () => {
            try {
                const data = await axios.post(`${BACKEND_URL}/v1/api/getStocks`, {
                    "_id": user.uid,
                });
                const stocks = data.data.filter((stock) => stock.status === "hold");
                setStocks(stocks);
            } catch (error) {
                console.error('Failed to fetch stocks:', error);
            }
        };
        if (user?.uid) {
            getStocks();
        }
    }, [user, setStocks]);

    const topThreeStocks = stocks.sort((a, b) => b.amount - a.amount).slice(0, 3);

    const calculateTotalValue = () => {
        
        return stocks.reduce((acc, stock) => acc + stock.amount, 0).toLocaleString('en-IN');
    };

    return (
        <div className='bg-[#181C3A] text-white w-full rounded-xl px-4 py-8'>
            <div className='mb-8'>
                <h1 className='font-bold'>Total Invested in Stocks</h1>
                <span className='text-[#09C9C8]'> <FaIndianRupeeSign className='inline-block' />{calculateTotalValue()}</span>
            </div>
            {topThreeStocks.map((stock) => (
                <div key={stock.id} className='w-full bg-[#252839] rounded-md mb-4 flex justify-between p-4 text-white gap-2'>
                    <div className='w-[70%]'>
                        <h2 className='ellipsis-container'>{stock.name}</h2>
                        <p className='text-[#ffffffb3] text-sm'>Invested: <FaIndianRupeeSign className='inline-block' />{stock.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div className='flex items-center justify-end gap-1 text-[#ffffffb3] h-4 w-[30%]'>
                        <FaBagShopping className='inline-block text-xs' />
                        <span className='text-xs'>{stock.quantity} Qty</span>
                    </div>
                </div>
            )
            )}
            <div className='flex justify-center'>
                <NavLink to={"/stocks"} className='text-white bg-[#252839] px-4 py-2 rounded-md'>View All</NavLink>
            </div>
        </div>
    );
}

export default TopThreeStocks;