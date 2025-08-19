import { useData } from "../contexts/DataContext";
import GroqAI from "../components/GroqAI";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ChatBotPage = () => {
  const { transactions } = useData();

  return (
    <div className="flex-1 p-4 flex flex-col">
      <Link
        to="/"
        className="flex items-center text-white mb-4 gap-2 hover:text-gray-300"
      >
        <FaArrowLeft /> Back
      </Link>
      <div className="flex-1 w-full flex justify-center items-center">
        <div className="bg-slate-800 rounded-lg shadow-lg p-4 w-full max-w-2xl">
          <GroqAI transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default ChatBotPage;
