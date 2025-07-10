import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, UserPlus, Building, Mail } from 'lucide-react';

interface SignUpPageProps {
  onSignUp: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    department: string;
  }) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onBackToLogin, isLoading = false, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const departments = [
    'Assets and Operations',
    'Customer Service',
    'Other Departments Muscat Bay'
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSignUp(formData);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background-primary dark:bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
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

        {/* Sign Up Form */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-neutral-border dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-secondary dark:text-gray-400">
              Join our water management system
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-error dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange('fullName')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                    errors.fullName 
                      ? 'border-error dark:border-error' 
                      : 'border-neutral-border dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.fullName}</p>
              )}
            </div>

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
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                    errors.email 
                      ? 'border-error dark:border-error' 
                      : 'border-neutral-border dark:border-gray-600'
                  }`}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Department Field */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                id="department"
                value={formData.department}
                onChange={handleInputChange('department')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                  errors.department 
                    ? 'border-error dark:border-error' 
                    : 'border-neutral-border dark:border-gray-600'
                }`}
                disabled={isLoading}
              >
                <option value="">Select your department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.department}</p>
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
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors ${
                    errors.confirmPassword 
                      ? 'border-error dark:border-error' 
                      : 'border-neutral-border dark:border-gray-600'
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary hover:text-primary dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary hover:text-primary dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl mt-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary dark:text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={onBackToLogin}
                className="text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign In
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

export default SignUpPage; 