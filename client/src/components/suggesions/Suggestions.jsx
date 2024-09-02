import { useState } from "react";
import StylishBtn from "../StylishBtn";
import axios from "axios";
import Markdown from 'react-markdown';
import { FaLocationArrow } from "react-icons/fa6";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Suggesions = () => {
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [generate, setGenerate] = useState(false);
    const [suggestions, setSuggestions] = useState(null);

    const handleGenerate = async () => {
        if (!inputValue || inputValue.length < 10) return;
        setLoading(true);
        setGenerate(true);

        try {
            const response = await axios.post(`${BACKEND_URL}/v1/api/ai`, {
                prompt: inputValue
            });
            setSuggestions(response.data.suggestion);
        } catch (err) {
            console.error("Error fetching suggestions:", err);
            setSuggestions("Error fetching suggestions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-[#181C3A] rounded-xl py-4 px-2 w-full h-[36rem] relative'>
            <h1 className="text-center text-[#09C9C8]">Chat with AI</h1>
            <div className="absolute top-3 right-3 text-[#09C9C8]">
                <StylishBtn text="BETA" />
            </div>
            <div className={`h-[27rem] my-4 px-4 overflow-y-scroll overflow-x-clip small-cursor`}>
                {!generate ? (
                    <div className="text-white p-4 bg-[#252839] rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">How can I assist you today?</h2>
                        <p className="mb-4">Feel free to ask me anything related to your financial needs. Here are some examples:</p>
                        <ul className="list-disc pl-5">
                            <li className="mb-2">📈 Provide financial advice on your current portfolio</li>
                            <li className="mb-2">📊 Offer guidance on managing your stocks</li>
                            <li className="mb-2">💸 Suggest ways to save on everyday expenses</li>
                            <li className="mb-2">📅 Help with budgeting and expense tracking</li>
                        </ul>
                        <p className="mt-4">Simply type your question or request into the input field below!</p>
                    </div>
                ) : (
                    <div className="text-white p-4 bg-[#252839] rounded-lg">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Markdown>{suggestions}</Markdown>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center bg-[#252839] py-1 pl-4 pr-2 rounded-full w-[93%] mx-auto">
                <input
                    type="text"
                    className="w-full bg-transparent focus:outline-none text-white"
                    placeholder="Ask something to AI"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div onClick={handleGenerate} className="text-white w-fit bg-[#09C9C8] text-xl p-2 rounded-full cursor-pointer">
                    <FaLocationArrow />
                </div>
            </div>
        </div>
    );
};

export default Suggesions;
