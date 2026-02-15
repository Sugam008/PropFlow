import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/navigation/AppNavigator';
import { WebSocketProvider } from './src/providers/WebSocketProvider';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { ToastProvider } from './src/providers/ToastProvider';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <WebSocketProvider>
          <SafeAreaProvider>
            <ErrorBoundary>
              <AppNavigator />
            </ErrorBoundary>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </WebSocketProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
