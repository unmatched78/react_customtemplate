import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1) Create a client
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    {/* 2) Wrap your app */}
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </AuthProvider>
);
