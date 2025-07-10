import React, { useState } from 'react';
import Layout from './components/Layout';
import WaterAnalysisModule from './components/modules/WaterAnalysisModule';
import ElectricityModule from './components/modules/ElectricityModule';
import ContractorTrackerModule from './components/modules/ContractorTrackerModule';
import StpPlantModule from './components/modules/StpPlantModule';
import HvacSystemModule from './components/modules/HvacSystemModule';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const MainApp: React.FC = () => {
    const [activeSection, setActiveSection] = useState('Water System');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const { isAuthenticated, login, signUp, isLoading, error } = useAuth();

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

    const handleLogin = async (credentials: { username: string; password: string }) => {
        try {
            await login(credentials);
        } catch (error) {
            // Error is handled by the AuthContext
            console.error('Login failed:', error);
        }
    };

    const handleSignUp = async (userData: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        fullName: string;
        department: string;
    }) => {
        try {
            await signUp(userData);
        } catch (error) {
            // Error is handled by the AuthContext
            console.error('Registration failed:', error);
        }
    };

    if (!isAuthenticated) {
        if (authMode === 'signup') {
            return (
                <SignUpPage 
                    onSignUp={handleSignUp}
                    onBackToLogin={() => setAuthMode('login')}
                    isLoading={isLoading}
                    error={error || undefined}
                />
            );
        }
        
        return (
            <LoginPage 
                onLogin={handleLogin}
                onGoToSignUp={() => setAuthMode('signup')}
                isLoading={isLoading}
                error={error || undefined}
            />
        );
    }

    return (
        <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
            {renderContent()}
        </Layout>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
};

export default App;