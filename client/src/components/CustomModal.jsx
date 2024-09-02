import { useState } from 'react';
import { toast } from 'react-toastify';

const CustomModal = ({ isOpen, onClose, onSubmit }) => {
    const [quantity, setQuantity] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');

    const handleSubmit = () => {
        if (!sellingPrice || !quantity){
            toast.error('All fields are required');
            return;
        }
        if (isNaN(sellingPrice) || isNaN(quantity)) {
            toast.error('Enter valid input');
            return;
        }
        onSubmit(Number(sellingPrice), Number(quantity));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#00000047] bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#181C3A] p-4 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-[#09C9C8] text-center">Enter Details</h2>

                <div className="mb-4">
                    <label className="block text-white mb-2">Selling Price</label>
                    <input
                        type="text"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="w-full rounded-lg p-2 bg-[#252839] focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2">Quantity</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full rounded-lg p-2 bg-[#252839] focus:outline-none"
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={onClose} className="mr-4">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default CustomModal;