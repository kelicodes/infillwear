import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API = "https://inf-1-udgs.onrender.com";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Save token
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API}/user/logout`, {
        method: "POST",
      });
    } catch (error) {}

    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  // Fetch logged in user
  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.me);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);