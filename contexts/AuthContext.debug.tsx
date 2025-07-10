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
  debugInfo: () => void;
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

// Debug function to check localStorage
const checkLocalStorageHealth = () => {
  try {
    const testKey = '__mbr_test__';
    localStorage.setItem(testKey, 'test');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved !== 'test') {
      console.error('❌ LocalStorage test failed: read/write mismatch');
      return false;
    }
    console.log('✅ LocalStorage is working properly');
    return true;
  } catch (error) {
    console.error('❌ LocalStorage is not available:', error);
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced initialization with debugging
  useEffect(() => {
    console.log('🔍 AuthContext: Initializing...');
    
    // Check localStorage health
    const isStorageHealthy = checkLocalStorageHealth();
    
    if (!isStorageHealthy) {
      setError('LocalStorage is not available. Please check your browser settings.');
      return;
    }

    try {
      // Log all MBR-related localStorage keys
      console.log('📦 Current localStorage state:');
      ['mbr_user', 'mbr_registered_users', 'mbr_login_time'].forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          console.log(`  ${key}:`, value.substring(0, 100) + '...');
        } else {
          console.log(`  ${key}: Not found`);
        }
      });

      // Try to restore user session
      const savedUser = localStorage.getItem('mbr_user');
      if (savedUser) {
        console.log('👤 Found saved user, attempting to restore session...');
        const userData = JSON.parse(savedUser);
        console.log('✅ User data parsed successfully:', userData.username);
        setUser(userData);
      } else {
        console.log('🔓 No saved user found, showing login page');
      }
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      setError('Failed to restore session. Please login again.');
      
      // Clean up corrupted data
      localStorage.removeItem('mbr_user');
      localStorage.removeItem('mbr_login_time');
    }
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    console.log('🔐 Login attempt for:', credentials.username);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { username, password } = credentials;
      
      // Check demo users first
      const userRecord = demoUsers[username.toLowerCase()];
      if (userRecord && userRecord.password === password) {
        console.log('✅ Demo user authenticated');
        const userData = userRecord.user;
        setUser(userData);
        localStorage.setItem('mbr_user', JSON.stringify(userData));
        localStorage.setItem('mbr_login_time', new Date().toISOString());
        return;
      }

      // Check registered users
      const registeredUsersStr = localStorage.getItem('mbr_registered_users');
      console.log('📋 Checking registered users:', registeredUsersStr ? 'Found' : 'None');
      
      const registeredUsers = JSON.parse(registeredUsersStr || '{}');
      const registeredUser = registeredUsers[username.toLowerCase()];
      
      if (!registeredUser || registeredUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      console.log('✅ Registered user authenticated');
      const userData = registeredUser.user;
      setUser(userData);
      
      // Save user data to localStorage for persistence
      localStorage.setItem('mbr_user', JSON.stringify(userData));
      localStorage.setItem('mbr_login_time', new Date().toISOString());
      
      // Verify save
      const savedCheck = localStorage.getItem('mbr_user');
      console.log('💾 User data saved:', savedCheck ? 'Success' : 'Failed');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('❌ Login error:', errorMessage);
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
    console.log('📝 Signup attempt for:', userData.username);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { username, email, password, fullName, department } = userData;

      // Check if username already exists
      const registeredUsersStr = localStorage.getItem('mbr_registered_users');
      const registeredUsers = JSON.parse(registeredUsersStr || '{}');
      
      console.log('📊 Current registered users count:', Object.keys(registeredUsers).length);
      
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

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: username.toLowerCase(),
        role: 'operator',
        fullName,
        department,
        permissions: ['read', 'write'],
        email: email.toLowerCase()
      };

      // Save to registered users
      registeredUsers[username.toLowerCase()] = {
        password,
        user: newUser
      };
      
      console.log('💾 Saving new user to localStorage...');
      localStorage.setItem('mbr_registered_users', JSON.stringify(registeredUsers));
      
      // Verify save
      const savedUsers = localStorage.getItem('mbr_registered_users');
      const verifyUsers = JSON.parse(savedUsers || '{}');
      if (!verifyUsers[username.toLowerCase()]) {
        throw new Error('Failed to save user data. Please check browser settings.');
      }
      
      console.log('✅ User registered successfully');

      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('mbr_user', JSON.stringify(newUser));
      localStorage.setItem('mbr_login_time', new Date().toISOString());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('❌ Signup error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    setUser(null);
    setError(null);
    localStorage.removeItem('mbr_user');
    localStorage.removeItem('mbr_login_time');
  };

  const clearError = () => {
    setError(null);
  };

  const debugInfo = () => {
    console.log('🔍 Debug Information:');
    console.log('Current user:', user);
    console.log('Is authenticated:', !!user);
    console.log('LocalStorage mbr_user:', localStorage.getItem('mbr_user'));
    console.log('LocalStorage mbr_registered_users:', localStorage.getItem('mbr_registered_users'));
    console.log('LocalStorage mbr_login_time:', localStorage.getItem('mbr_login_time'));
    console.log('Browser info:', {
      userAgent: navigator.userAgent,
      localStorage: typeof Storage !== 'undefined',
      url: window.location.href
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signUp,
    logout,
    clearError,
    debugInfo
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