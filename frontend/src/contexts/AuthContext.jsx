import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
axios.defaults.baseURL = BACKEND_URL;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticated = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp ? payload.exp > currentTime : true;
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem("authToken");
      return false;
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { success: false, message: "No token found" };
    }

    try {
      const response = await axios.get("/api/v1/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data.user;
      return { success: true, user: userData };
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || "Failed to fetch profile";

      if (status === 401) {
        localStorage.removeItem("authToken");
      }

      return { success: false, message };
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const isAuth = authenticated();
        if (!isAuth) {
          setUser(null);
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
        const result = await fetchUserProfile();

        if (result.success) {
          setUser(result.user);
        } else {
          console.warn("Auth init failed:", result.message);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error during auth init:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // // Optional: Track user state changes
  // useEffect(() => {
  //   console.log("User state changed:", user);
  // }, [user]);


  const login = async (email, password) => {
    try {
      const response = await axios.post("api/v1/users/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true, data };
      }

      throw new Error("No token received");
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post("api/v1/users/auth/signup", {
        name,
        email,
        password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        return { success: true, data };
      }

      throw new Error("No token received");
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Signup failed",
      };
    }
  };

  const logout = (redirect = false) => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);

    if (redirect) {
      window.location.href = "/signin";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        signup,
        login,
        logout,
        setUser,
        authenticated,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
