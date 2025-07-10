import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, LogIn, Building } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onGoToSignUp: () => void;
  isLoading?: boolean;
  error?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToSignUp, isLoading = false, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onLogin(formData);
  };

  const handleInputChange = (field: 'username' | 'password') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background-primary dark:bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-header-primary to-header-secondary rounded-2xl flex items-center justify-center shadow-xl">
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
            Muscat Bay
          </h1>
          <p className="text-secondary dark:text-gray-300">
            Assets & Operations Management
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-neutral-border dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-secondary dark:text-gray-400">
              Please sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                    errors.username 
                      ? 'border-error dark:border-error' 
                      : 'border-neutral-border dark:border-gray-600'
                  }`}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                    errors.password 
                      ? 'border-error dark:border-error' 
                      : 'border-neutral-border dark:border-gray-600'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary hover:text-primary dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary hover:text-primary dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary dark:text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={onGoToSignUp}
                className="text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-secondary dark:text-gray-400">
            © 2025 Muscat Bay. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 