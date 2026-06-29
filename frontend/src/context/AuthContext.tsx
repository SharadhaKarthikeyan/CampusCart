import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('campuscart_token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          console.error('Failed to verify token on reload', err);
          // Token expired or invalid
          localStorage.removeItem('campuscart_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('campuscart_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to login. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem('campuscart_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to register. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('campuscart_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
