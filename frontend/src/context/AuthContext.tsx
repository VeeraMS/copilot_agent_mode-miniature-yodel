import { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  initials: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

function deriveUserProfile(email: string): UserProfile {
  const localPart = email.split('@')[0];
  const parts = localPart.split('.');
  const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  const initials = parts.map(p => p.charAt(0).toUpperCase()).join('');
  return {
    name,
    email,
    phone: '(555) 123-4567',
    initials,
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = async (email: string, password: string) => {
    // In a real app, you would validate credentials with an API
    // For now, we'll just check the email domain
    if (email && password) {
      setIsLoggedIn(true);
      setIsAdmin(email.endsWith('@github.com'));
      setUser(deriveUserProfile(email));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}