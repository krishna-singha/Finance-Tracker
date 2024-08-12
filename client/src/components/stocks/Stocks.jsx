import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBagShopping, FaIndianRupeeSign } from "react-icons/fa6";

const TopThreeStocks = () => {
    // const [stocks, setStocks] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchStocks = async () => {
    //         const res = await axios.get('/api/stocks/top-three');
    //         setStocks(res.data);
    //         setLoading(false);
    //     };

    //     fetchStocks();
    // }, []);

    const stocks = [
        { name: 'One 97 Communications Ltd', quantity: 1, invested: 403.00, price: 527.00 },
        { name: 'Tata Steel Ltd', quantity: 2, invested: 280.46, price: 158.22 },
        { name: 'Alphabet Inc', quantity: 1, invested: 130.00, price: 150.00 },
    ];

    const calculateTotalValue = () => {
        return stocks.reduce((acc, stock) => acc + stock.price * stock.quantity, 0
        );
    };

        return (
            <div className='bg-[#181C3A] text-white w-full rounded-xl px-4 py-8'>
                {/* {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <h1>Top Three Stocks</h1>
                    <ul>
                        {stocks.map((stock) => (
                            <li key={stock.id}>{stock.name}</li>
                        ))}
                    </ul>
                </div>
            )} */}
                <div className='mb-8'>
                    <h1 className='font-bold'>Top Holding Stocks</h1>
                    <span> <FaIndianRupeeSign className='inline-block' />{calculateTotalValue()}</span>
                </div>
                {stocks.map((stock) => (
                    <div key={stock.id} className='w-full bg-[#252839] rounded-md mb-4 flex justify-between p-4 text-white gap-2'>
                        <div className='w-[70%]'>
                            <h2 className='ellipsis-container'>{stock.name}</h2>
                            <p className='text-[#ffffffb3] text-sm'>Value: <FaIndianRupeeSign className='inline-block' />{stock.price * stock.quantity}</p>
                        </div>
                        <div className='flex items-center justify-end gap-1 text-[#ffffffb3] h-4 w-[30%]'>
                            <FaBagShopping className='inline-block text-xs' />
                            <span className='text-xs'>{stock.quantity} Qty</span>
                            {/* <button className=' text-white px-4 py-2 rounded-md'>Buy</button> */}
                        </div>
                    </div>
                )
                )}
                <div className='flex justify-center'>
                    <button className='text-white bg-[#252839] px-4 py-2 rounded-md'>View All</button>
                </div>
            </div>
        );
    }

    export default TopThreeStocks;