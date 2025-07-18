import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ChatBotContext = createContext();

export const useChatBot = () => useContext(ChatBotContext);

export const ChatBotProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    if (!user) setConversationHistory([]);
  }, [user]);

  const contextValue = useMemo(
    () => ({
      conversationHistory,
      setConversationHistory,
    }),
    [conversationHistory]
  );

  return (
    <ChatBotContext.Provider value={contextValue}>
      {children}
    </ChatBotContext.Provider>
  );
};