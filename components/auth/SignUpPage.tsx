import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Building } from 'lucide-react';

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

const SignUpPage: React.FC<SignUpPageProps> = ({ onBackToLogin }) => {
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

        {/* Clerk Sign Up Component */}
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-neutral-border dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-primary dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-secondary dark:text-gray-400">
              Join our water management system
            </p>
          </div>

          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white dark:bg-gray-700 border border-neutral-border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-primary dark:text-white",
                formButtonPrimary: "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg hover:shadow-xl",
                formFieldInput: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors border-neutral-border",
                formFieldLabel: "block text-sm font-medium text-primary dark:text-gray-300 mb-2",
                identityPreviewText: "text-secondary dark:text-gray-400",
                identityPreviewEditButton: "text-accent hover:text-accent/80",
                footerActionLink: "text-accent hover:text-accent/80 font-medium transition-colors",
                footerActionText: "text-secondary dark:text-gray-400"
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton"
              }
            }}
            routing="hash"
            signInUrl="#/sign-in"
          />

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary dark:text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={onBackToLogin}
                className="text-accent hover:text-accent/80 font-medium transition-colors"
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