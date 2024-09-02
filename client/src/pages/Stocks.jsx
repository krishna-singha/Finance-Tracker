import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/userAtom';
import CustomModal from '../components/CustomModal';
import { toast } from 'react-toastify';

const Stocks = () => {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('hold');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        const getStocks = async () => {
            setLoading(true);
            try {
                const data = await axios.post(`${BACKEND_URL}/v1/api/getStocks`, {
                    "_id": user.uid,
                });
                setStocks(data.data);
            } catch (error) {
                console.error('Failed to fetch stocks:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.uid) {
            getStocks();
        }
    }, [user]);

    const sortedStocks = useMemo(() => {
        return stocks.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [stocks]);

    const filteredStocks = useMemo(() => {
        return sortedStocks.filter(stock => {
            if (filter === 'hold') return stock.status === 'hold';
            return stock.status === 'sold';
        });
    }, [sortedStocks, filter]);

    const handleOption = (selectedStock) => {
        setModalOpen(true);
        setSelectedStock(selectedStock);
    };
    const handleSubmit = async (sellingPrice, quantity, stock) => {
        try {
            const data = await axios.post(`${BACKEND_URL}/v1/api/sellStock`, {
                _id: user.uid,
                stockName: stock.name,
                sellingPrice,
                stockQuantity: quantity,
            });
            if (data.status === 200) {
                toast.success('Stock sold successfully!');
                setModalOpen(false);
                setSelectedStock(null);
            } else {
                toast.error('Failed to sell stock.');
            }
        } catch (error) {
            toast.error('Failed to sell stock.');
        }
    };


    if (loading) {
        return <div className="text-white flex justify-center items-center min-h-screen">Loading stocks...</div>;
    }

    return (
        <div className="text-white bg-primary max-w-[1550px] mx-auto min-h-screen my-4 rounded-xl py-6 px-8">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-[#09C9C8]">Stocks</h1>
                <div className="flex gap-4">
                    {['hold', 'sold'].map(category => (
                        <div
                            key={category}
                            className={`border rounded-xl py-1 px-3 cursor-pointer transition duration-300 ease-in-out hover:border-[#09C9C8] hover:text-[#09C9C8] ${filter === category ? 'border-[#09C9C8] text-[#09C9C8]' : ''
                                }`}
                            onClick={() => setFilter(category)}
                        >
                            <h2>{category}</h2>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 rounded-xl p-6">
                <table className="w-full text-left table-auto border-collapse">
                    <thead>
                        <tr className="font-bold h-12 bg-[#0A0F27]">
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 max-w-[40%]">Name</th>
                            {filter === 'hold' ?
                                <th className="px-6 py-4 text-center">Invested</th>
                                : <th className="px-6 py-4 text-center">Sold at</th>}
                            <th className="px-6 py-4 text-center">Quantity</th>
                            {filter === "hold" && <th className="pr-6 w-[2%]"></th>}
                        </tr>
                    </thead>
                    <tbody className="text-[0.9rem]">
                        {filteredStocks.map((stock, index) => (
                            <tr
                                key={index}
                                className={`border-b border-[#ffffff0a] bg-[#181C3A] ${index % 2 === 0 ? 'bg-[#1F243E]' : ''
                                    } hover:bg-[#1A1F38] transition-colors duration-200 ease-in-out`}
                            >
                                <td className="px-6 py-4">{stock.date}</td>
                                <td className="px-6 py-4 max-w-[40%]">{stock.name}</td>
                                <td className={`px-6 py-4 text-center ${filter === "hold" ? "text-red-500" : "text-green-500"}`}>
                                    {filter === "hold" && "-"}
                                    <FaIndianRupeeSign className='inline-block' />
                                    {stock.amount.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 text-center">{stock.quantity}</td>
                                {filter === "hold" && (
                                    <td className="pr-6 w-[2%]">
                                        <BsThreeDots className='cursor-pointer text-xl' onClick={() => handleOption(stock)} />
                                        <CustomModal
                                            isOpen={isModalOpen}
                                            onClose={() => setModalOpen(false)}
                                            onSubmit={(sellingPrice, quantity) => handleSubmit(sellingPrice, quantity, selectedStock)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stocks;
