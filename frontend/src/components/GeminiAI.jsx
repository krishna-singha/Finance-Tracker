import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import { FaRobot, FaUser, FaCopy, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import ReactMarkdown from 'react-markdown';

const  GeminiAI = ({ transactions = [] }) => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please login to chat with AI');
      return;
    }
    if (!inputValue || inputValue.trim().length < 3) {
      toast.error('Please enter a valid question');
      return;
    }
    
    const userMessage = inputValue.trim();
    setLoading(true);
    
    // Add user message to conversation
    setConversationHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setInputValue("");

    try {
      // Make actual API call to backend Gemini endpoint
      const response = await fetchWithAuth(apiEndpoints.ai, {
        method: 'POST',
        body: JSON.stringify({
          userPrompt: userMessage,
          data: transactions,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const aiMessage = result.suggestion || result.response || result.data || "I couldn't generate a response at this time.";
      
      // Add AI response to conversation
      setConversationHistory(prev => [...prev, { type: 'ai', message: aiMessage }]);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      const errorMessage = "Sorry, I'm having trouble connecting right now. Please try again later.";
      setConversationHistory(prev => [...prev, { type: 'ai', message: errorMessage }]);
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
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
    <div className='bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 h-[500px] flex flex-col'>
      <div className="flex items-center justify-between mb-4">
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
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {!isAuthenticated ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-cyan-500/20 border border-cyan-400/30 w-fit mx-auto mb-4">
              <FaRobot className="text-3xl text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Welcome to Your AI Assistant!</h3>
            <p className="text-gray-300">Please sign in to start chatting with our AI financial advisor.</p>
          </div>
        ) : (
          <>
            {conversationHistory.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-3">How can I help you today?</h3>
                  <p className="text-gray-300 mb-4">Ask me anything about your finances! Here are some suggestions:</p>
                </div>
                
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="block w-full text-left p-3 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      💡 {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              conversationHistory.map((item, index) => (
                <div key={index} className={`flex gap-3 ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {item.type === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    item.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                      : 'bg-white/10 text-white border border-white/20'
                  }`}>
                    {item.type === 'ai' ? (
                      <div>
                        <div className="markdown-content text-sm prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown 
                            components={{
                              // Custom styling for markdown elements
                              h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 text-cyan-400" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 text-cyan-300" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 text-cyan-200" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="text-gray-200" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                              code: ({node, inline, ...props}) => 
                                inline 
                                  ? <code className="bg-gray-700/50 px-1 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props} />
                                  : <pre className="bg-gray-800/50 p-2 rounded my-2 overflow-x-auto"><code className="text-cyan-300 font-mono text-xs block" {...props} /></pre>,
                              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-cyan-400 pl-3 italic text-gray-300 my-2" {...props} />,
                              table: ({node, ...props}) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-gray-700/30" {...props} /></div>,
                              th: ({node, ...props}) => <th className="px-2 py-1 bg-gray-800/30 font-medium text-left text-cyan-200" {...props} />,
                              td: ({node, ...props}) => <td className="px-2 py-1 border-t border-gray-700/30" {...props} />
                            }}
                          >
                            {item.message}
                          </ReactMarkdown>
                        </div>
                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/20">
                          <button
                            onClick={() => copyToClipboard(item.message)}
                            className="text-gray-400 hover:text-white transition-colors"
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
                  
                  {item.type === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className="bg-white/10 p-3 rounded-lg border border-white/20">
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
      
      <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/20 focus-within:border-cyan-400/50 transition-colors">
        <input
          type="text"
          className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400"
          placeholder={isAuthenticated ? "Ask about your finances..." : "Please login to chat"}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isAuthenticated || loading}
        />
        <button
          onClick={handleGenerate}
          disabled={!isAuthenticated || loading || !inputValue.trim()}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
};

export default GeminiAI;
