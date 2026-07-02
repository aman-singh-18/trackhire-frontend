import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when application mounts
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await API.get("/auth/profile");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Token is missing or expired, clear user state quietly
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.success) {
        // Fetch profile right after login to capture user details
        const profileRes = await API.get("/auth/profile");
        setUser(profileRes.data.user);
      }
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      return { success: true, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for cleaner imports in your pages
export const useAuth = () => useContext(AuthContext);