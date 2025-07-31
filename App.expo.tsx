import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from './App';

export default function ExpoApp() {
  return (
    <SafeAreaProvider>
      <App />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 