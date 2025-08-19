import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AllTransactions from "./pages/AllTransactions";
import Profile from "./pages/Profile";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import ChatBotPage from "./pages/ChatBotPage";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={isAuthenticated ? <Dashboard /> : <Landing />} />

          <Route path="/signin" element={!isAuthenticated ? <SigninPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-transactions"
            element={
              <ProtectedRoute>
                <AllTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Mobile Chatbot page */}
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <ChatBotPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
