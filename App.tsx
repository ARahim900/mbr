import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut, useUser, SignIn, SignUp } from '@clerk/clerk-react';
import Layout from './components/Layout';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import ElectricityModule from './components/modules/ElectricityModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import { Building } from 'lucide-react';

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('🔍 Debug Info:');
console.log('Clerk Publishable Key:', clerkPubKey ? `${clerkPubKey.substring(0, 15)}...` : 'MISSING');

if (!clerkPubKey) {
  console.error('❌ Missing Clerk Publishable Key');
  throw new Error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file');
}

const MainApp: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Water System');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const { user, isLoaded } = useUser();

    console.log('🔍 MainApp Debug:', { user, isLoaded, activeSection });

    const renderContent = () => {
        switch (activeSection) {
            case 'Water System':
                return <WaterAnalysisModule />;
            case 'Electricity System':
                return <ElectricityModule />;
            case 'HVAC System':
                return <HvacSystemModule />;
            case 'Contractor Tracker':
                return <ContractorTrackerModule />;
            case 'STP Plant':
                return <StpPlantModule />;
            default:
                return <WaterAnalysisModule />;
        }
    };

    // Show loading state while Clerk is loading
    if (!isLoaded) {
        console.log('⏳ Clerk is loading...');
        return (
            <div className="min-h-screen bg-background-primary dark:bg-primary flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-primary dark:text-white">Loading authentication...</p>
                </div>
            </div>
        );
    }

    console.log('🔍 Rendering main app with user:', user);

    return (
        <>
            <SignedOut>
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

                        {/* Authentication Component */}
                        <div className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-neutral-border dark:border-gray-700">
                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-primary dark:text-white mb-2">
                                    {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                                </h2>
                                <p className="text-secondary dark:text-gray-400">
                                    {authMode === 'signup' ? 'Join our water management system' : 'Please sign in to your account'}
                                </p>
                            </div>

                            {authMode === 'signup' ? (
                                <SignUp 
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-transparent shadow-none border-none",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            socialButtonsBlockButton: "w-full mb-4 bg-white dark:bg-gray-700 border-2 border-neutral-border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-primary dark:text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center gap-3",
                                            socialButtonsBlockButtonText: "font-medium text-primary dark:text-white",
                                            socialButtonsBlockButtonArrow: "text-primary dark:text-white",
                                            dividerLine: "bg-neutral-border dark:bg-gray-600",
                                            dividerText: "text-secondary dark:text-gray-400 bg-white dark:bg-gray-800 px-4",
                                            formButtonPrimary: "w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg hover:shadow-xl",
                                            formFieldInput: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors border-neutral-border",
                                            formFieldLabel: "block text-sm font-medium text-primary dark:text-gray-300 mb-2",
                                            identityPreviewText: "text-secondary dark:text-gray-400",
                                            identityPreviewEditButton: "text-accent hover:text-accent/80",
                                            footerActionLink: "text-accent hover:text-accent/80 font-medium transition-colors",
                                            footerActionText: "text-secondary dark:text-gray-400"
                                        },
                                        layout: {
                                            socialButtonsPlacement: "top",
                                            socialButtonsVariant: "blockButton",
                                            showOptionalFields: true
                                        }
                                    }}
                                    routing="hash"
                                    signInUrl="#/sign-in"
                                />
                            ) : (
                                <SignIn 
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-transparent shadow-none border-none",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            socialButtonsBlockButton: "w-full mb-4 bg-white dark:bg-gray-700 border-2 border-neutral-border dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-primary dark:text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg hover:shadow-xl flex items-center justify-center gap-3",
                                            socialButtonsBlockButtonText: "font-medium text-primary dark:text-white",
                                            socialButtonsBlockButtonArrow: "text-primary dark:text-white",
                                            dividerLine: "bg-neutral-border dark:bg-gray-600",
                                            dividerText: "text-secondary dark:text-gray-400 bg-white dark:bg-gray-800 px-4",
                                            formButtonPrimary: "w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-lg hover:shadow-xl",
                                            formFieldInput: "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent transition-colors border-neutral-border",
                                            formFieldLabel: "block text-sm font-medium text-primary dark:text-gray-300 mb-2",
                                            identityPreviewText: "text-secondary dark:text-gray-400",
                                            identityPreviewEditButton: "text-accent hover:text-accent/80",
                                            footerActionLink: "text-accent hover:text-accent/80 font-medium transition-colors",
                                            footerActionText: "text-secondary dark:text-gray-400"
                                        },
                                        layout: {
                                            socialButtonsPlacement: "top",
                                            socialButtonsVariant: "blockButton",
                                            showOptionalFields: true
                                        }
                                    }}
                                    routing="hash"
                                    signUpUrl="#/sign-up"
                                />
                            )}

                            {/* Toggle between Sign In and Sign Up */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-secondary dark:text-gray-400">
                                    {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                                    <button 
                                        onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                                        className="text-accent hover:text-accent/80 font-medium transition-colors"
                                    >
                                        {authMode === 'signup' ? 'Sign In' : 'Create Account'}
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
            </SignedOut>
            <SignedIn>
                <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
                    {renderContent()}
                </Layout>
            </SignedIn>
        </>
    );
};

const App: React.FC = () => {
    console.log('🚀 App component initializing...');
    
    try {
        return (
            <ClerkProvider publishableKey={clerkPubKey}>
                <MainApp />
            </ClerkProvider>
        );
    } catch (error) {
        console.error('❌ Error in App component:', error);
        return (
            <div className="min-h-screen bg-red-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
                    <p className="text-red-500 mb-4">There was an error loading the application.</p>
                    <pre className="text-sm bg-red-100 p-4 rounded text-left">
                        {error instanceof Error ? error.message : 'Unknown error'}
                    </pre>
                </div>
            </div>
        );
    }
};

export default App;