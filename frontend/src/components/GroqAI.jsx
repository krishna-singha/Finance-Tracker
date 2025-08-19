import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useChatBot } from "../contexts/ChatBotContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import { FaRobot, FaCopy, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const GroqAI = ({ transactions = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { conversationHistory, setConversationHistory } = useChatBot();

  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to chat with AI");
      return;
    }

    const userMessage = inputValue.trim();
    setLoading(true);

    setConversationHistory((prev) => [
      ...prev,
      { type: "user", message: userMessage },
    ]);
    setInputValue("");

    try {
      const response = await fetchWithAuth(apiEndpoints.ai, {
        method: "POST",
        body: JSON.stringify({ userPrompt: userMessage, data: transactions }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      const aiMessage =
        result.suggestion ||
        result.response ||
        result.data ||
        "I couldn't generate a response at this time.";

      setConversationHistory((prev) => [
        ...prev,
        { type: "ai", message: aiMessage },
      ]);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "ai",
          message:
            "Sorry, I'm having trouble connecting right now. Please try again later.",
        },
      ]);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const suggestedQuestions = [
    "Analyze my spending patterns and give me insights",
    "How can I improve my financial health?",
    "What budgeting strategy would work best for me?",
    "Give me personalized investment advice",
    "How can I reduce my expenses?",
    "What are some ways to increase my income?",
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-400/30 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
            <FaRobot className="text-cyan-400" />
          </div>
          AI Financial Assistant
        </h2>
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-cyan-400/30">
          BETA
        </div>
      </div>

      {/* Chat Area */}
      <div className=" h-[60vh] flex flex-col overflow-y-auto pr-1 my-2 space-y-4 custom-scrollbar">
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-cyan-500/20 border border-cyan-400/30 w-fit mx-auto mb-4">
              <FaRobot className="text-3xl text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Welcome to Your AI Assistant!
            </h3>
            <p className="text-gray-300">
              Please sign in to start chatting with our AI financial advisor.
            </p>
          </div>
        ) : (
          <>
            {conversationHistory.length === 0 ? (
              <div className="space-y-4 flex-1 flex flex-col justify-end mb-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    How can I help you today?
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Ask me anything about your finances! Here are some
                    suggestions:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="cursor-pointer px-4 py-2 bg-white/10 rounded-full text-sm text-cyan-200 hover:bg-cyan-500/20 border border-cyan-400/10 transition-colors"
                    >
                      💡 {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              conversationHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-2 ${
                    item.type === "user" ? "items-end" : " items-start"
                  }`}
                >
                  {item.type === "ai" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}
                  {item.type === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      item.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                        : "bg-white/10 text-white border border-white/20 rounded-bl-none"
                    }`}
                  >
                    {item.type === "ai" ? (
                      <div>
                        <div className="markdown-content text-sm prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{item.message}</ReactMarkdown>
                        </div>
                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/20">
                          <button
                            onClick={() => copyToClipboard(item.message)}
                            className="cursor-pointer text-gray-400 hover:text-white transition-colors"
                            title="Copy response"
                          >
                            <FaCopy className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">{item.message}</div>
                    )}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white/10 p-3 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
                    <p className="text-gray-300 text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 left-0 w-full">
        <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/20 focus-within:border-cyan-400/50 transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400"
            placeholder={
              isAuthenticated
                ? "Ask about your finances..."
                : "Please login to chat"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isAuthenticated || loading}
            autoFocus
          />
          <button
            onClick={handleGenerate}
            disabled={!isAuthenticated || loading || !inputValue.trim()}
            className="cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroqAI;
