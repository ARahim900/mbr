import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'manager' | 'operator';
  fullName: string;
  department: string;
  permissions: string[];
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  signUp: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    department: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for authentication
const demoUsers: Record<string, { password: string; user: User }> = {
  admin: {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      role: 'admin',
      fullName: 'System Administrator',
      department: 'IT Operations',
      permissions: ['read', 'write', 'delete', 'admin', 'reports', 'settings']
    }
  },
  manager: {
    password: 'manager123',
    user: {
      id: '2',
      username: 'manager',
      role: 'manager',
      fullName: 'Operations Manager',
      department: 'Operations',
      permissions: ['read', 'write', 'reports', 'approve']
    }
  },
  operator: {
    password: 'operator123',
    user: {
      id: '3',
      username: 'operator',
      role: 'operator',
      fullName: 'System Operator',
      department: 'Maintenance',
      permissions: ['read', 'write']
    }
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mbr_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('mbr_user');
      }
    }
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { username, password } = credentials;
      
      // Check demo users first
      const userRecord = demoUsers[username.toLowerCase()];
      if (userRecord && userRecord.password === password) {
        const userData = userRecord.user;
        setUser(userData);
        localStorage.setItem('mbr_user', JSON.stringify(userData));
        localStorage.setItem('mbr_login_time', new Date().toISOString());
        return;
      }

      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('mbr_registered_users') || '{}');
      const registeredUser = registeredUsers[username.toLowerCase()];
      
      if (!registeredUser || registeredUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      const userData = registeredUser.user;
      setUser(userData);
      
      // Save user data to localStorage for persistence
      localStorage.setItem('mbr_user', JSON.stringify(userData));
      localStorage.setItem('mbr_login_time', new Date().toISOString());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    department: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { username, email, password, fullName, department } = userData;

      // Check if username already exists (demo users + registered users)
      const registeredUsers = JSON.parse(localStorage.getItem('mbr_registered_users') || '{}');
      
      if (demoUsers[username.toLowerCase()] || registeredUsers[username.toLowerCase()]) {
        throw new Error('Username already exists. Please choose a different username.');
      }

      // Check if email already exists
      const existingEmailUser = Object.values(registeredUsers).find(
        (user: any) => user.user.email === email.toLowerCase()
      );
      if (existingEmailUser) {
        throw new Error('Email address already registered. Please use a different email.');
      }

      // Create new user - default to 'operator' role
      const newUser: User = {
        id: Date.now().toString(),
        username: username.toLowerCase(),
        role: 'operator', // Default role for all new signups
        fullName,
        department,
        permissions: ['read', 'write'], // Default operator permissions
        email: email.toLowerCase()
      };

      // Save to registered users
      registeredUsers[username.toLowerCase()] = {
        password,
        user: newUser
      };
      
      localStorage.setItem('mbr_registered_users', JSON.stringify(registeredUsers));

      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('mbr_user', JSON.stringify(newUser));
      localStorage.setItem('mbr_login_time', new Date().toISOString());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('mbr_user');
    localStorage.removeItem('mbr_login_time');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signUp,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext; 