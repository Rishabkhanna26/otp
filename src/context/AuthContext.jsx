import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('otp_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (Date.now() - session.loginTime < 48 * 60 * 60 * 1000) {
          setUser(session.user);
        } else {
          localStorage.removeItem('otp_session');
        }
      } catch {
        localStorage.removeItem('otp_session');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('otp_session', JSON.stringify({ user: userData, loginTime: Date.now() }));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('otp_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
