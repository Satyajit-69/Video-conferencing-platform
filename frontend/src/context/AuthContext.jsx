import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [welcomeMode, setWelcomeMode] = useState(() => {
    return localStorage.getItem("welcomeMode") || "login";
  });

  const [loading, setLoading] = useState(false);

  // ------------------------------------
  // LOGIN
  // ------------------------------------
  const login = async (username, password) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setWelcomeMode("login");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("welcomeMode", "login");

      return { success: true };

    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // REGISTER
  // ------------------------------------
  const register = async (name, username, password) => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUser(data.user);
      setWelcomeMode("register");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("welcomeMode", "register");

      return { success: true };

    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // LOGOUT
  // ------------------------------------
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("welcomeMode");
    setUser(null);
    setWelcomeMode("login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        welcomeMode,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
