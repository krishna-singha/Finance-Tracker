import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";
import { ChatBotProvider } from "./contexts/ChatBotContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <ChatBotProvider>
          <App />
        </ChatBotProvider>
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);
