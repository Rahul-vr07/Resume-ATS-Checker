import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // In a real app, we would check for an existing token or session
  const [user, setUser] = useState<User | null>({
    id: 'user-1',
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
  });
  
  const login = async (phone: string, otp: string): Promise<boolean> => {
    // In a real app, this would make an API call to verify OTP
    if (otp === '1234') {
      setUser({
        id: 'user-1',
        name: 'John Doe',
        phone: phone,
      });
      return true;
    }
    return false;
  };
  
  const logout = () => {
    // In a real app, this would clear tokens or session
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};