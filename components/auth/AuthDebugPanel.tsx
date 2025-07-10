import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle, XCircle, RefreshCw, UserPlus, Trash2 } from 'lucide-react';

const AuthDebugPanel: React.FC = () => {
  const { user, isAuthenticated, debugInfo } = useAuth();
  const [showPanel, setShowPanel] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testLocalStorage = () => {
    try {
      const testKey = 'mbr_test_' + Date.now();
      const testValue = 'test_value_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      if (retrieved === testValue) {
        setTestResult('✅ LocalStorage is working correctly!');
        return true;
      } else {
        setTestResult('❌ LocalStorage read/write mismatch');
        return false;
      }
    } catch (error) {
      setTestResult(`❌ LocalStorage error: ${error}`);
      return false;
    }
  };

  const createTestUser = () => {
    try {
      const timestamp = Date.now();
      const testUser = {
        [`testuser_${timestamp}`]: {
          password: 'Test1234',
          user: {
            id: timestamp.toString(),
            username: `testuser_${timestamp}`,
            role: 'operator',
            fullName: 'Test User ' + timestamp,
            department: 'Assets and Operations',
            permissions: ['read', 'write'],
            email: `test_${timestamp}@muscatbay.com`
          }
        }
      };
      
      const existingUsers = JSON.parse(localStorage.getItem('mbr_registered_users') || '{}');
      const updatedUsers = { ...existingUsers, ...testUser };
      
      localStorage.setItem('mbr_registered_users', JSON.stringify(updatedUsers));
      setTestResult(`✅ Test user created! Username: testuser_${timestamp}, Password: Test1234`);
    } catch (error) {
      setTestResult(`❌ Failed to create test user: ${error}`);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all authentication data?')) {
      localStorage.removeItem('mbr_user');
      localStorage.removeItem('mbr_registered_users');
      localStorage.removeItem('mbr_login_time');
      setTestResult('🗑️ All authentication data cleared. Please refresh the page.');
    }
  };

  const getStorageInfo = () => {
    const user = localStorage.getItem('mbr_user');
    const registeredUsers = localStorage.getItem('mbr_registered_users');
    const loginTime = localStorage.getItem('mbr_login_time');
    
    let userCount = 0;
    try {
      const users = JSON.parse(registeredUsers || '{}');
      userCount = Object.keys(users).length;
    } catch (e) {
      // ignore
    }
    
    return {
      hasUser: !!user,
      hasRegisteredUsers: !!registeredUsers,
      registeredUserCount: userCount,
      loginTime: loginTime
    };
  };

  const storageInfo = getStorageInfo();

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
        title="Open Debug Panel"
      >
        <AlertCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-96 z-50 max-h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auth Debug Panel</h3>
        <button
          onClick={() => setShowPanel(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {/* Current Status */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm">
            Authentication: {isAuthenticated ? 'Logged In' : 'Not Logged In'}
          </span>
        </div>
        
        {user && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            User: {user.username} ({user.role})
          </div>
        )}
      </div>

      {/* Storage Info */}
      <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
        <h4 className="font-medium mb-2 text-sm">LocalStorage Status:</h4>
        <div className="space-y-1 text-xs">
          <div>Current User: {storageInfo.hasUser ? '✅ Found' : '❌ Not found'}</div>
          <div>Registered Users: {storageInfo.registeredUserCount} users</div>
          <div>Last Login: {storageInfo.loginTime ? new Date(storageInfo.loginTime).toLocaleString() : 'Never'}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 mb-4">
        <button
          onClick={testLocalStorage}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Test LocalStorage</span>
        </button>
        
        <button
          onClick={createTestUser}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Test User</span>
        </button>
        
        <button
          onClick={() => debugInfo()}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
        >
          Log Debug Info to Console
        </button>
        
        <button
          onClick={clearAllData}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All Data</span>
        </button>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
          {testResult}
        </div>
      )}

      {/* Browser Info */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <div>URL: {window.location.href}</div>
        <div>Protocol: {window.location.protocol}</div>
        <div>Private Mode: {!window.indexedDB ? 'Possibly' : 'No'}</div>
      </div>
    </div>
  );
};

export default AuthDebugPanel;