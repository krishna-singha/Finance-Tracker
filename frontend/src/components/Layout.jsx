import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaRobot } from "react-icons/fa";
import { useState, useEffect } from "react";
import GroqAI from "./GroqAI";
import { useData } from "../contexts/DataContext";

const Layout = () => {
  const { transactions } = useData();
  const [isMobile, setIsMobile] = useState(false);
  const [openChatBot, setOpenChatBot] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect mobile screens
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // Tailwind sm breakpoint
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatBotClick = () => {
    if (isMobile) {
      // Open chatbot in a separate page
      navigate("/chatbot");
    } else {
      setOpenChatBot(!openChatBot);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col w-full relative">
      <div className="absolute inset-0 bg-grid bg-[size:50px_50px]" />
      <Navbar />
      <main className="z-10 flex-1 flex flex-col relative">
        <Outlet />

        {/* Chatbot Toggle Button */}
        {location.pathname !== "/chatbot" && (
          <div
            onClick={handleChatBotClick}
            className="w-fit fixed bottom-6 right-6 p-2 backdrop-blur-xl rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 hover:scale-110 transition-transform cursor-pointer z-50"
          >
            <FaRobot className="text-cyan-400" size={30} />
          </div>
        )}

        {/* Chatbot Panel for Desktop */}
        {!isMobile && openChatBot && (
          <div className="fixed bottom-20 right-6 z-[9999] flex flex-col w-[30rem] max-w-[95vw] h-[40rem] max-h-[90vh] bg-white/20 backdrop-blur-lg rounded-lg p-4 shadow-lg border border-gray-700 sm:right-2 sm:bottom-2">
            <GroqAI transactions={transactions} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
