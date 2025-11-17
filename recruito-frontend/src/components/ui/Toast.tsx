import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ToastProvider = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={8}
    toastOptions={{
      duration: 4000,
      style: {
        background: '#fff',
        color: '#1f2937',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '500',
      },
      success: {
        duration: 3000,
        style: {
          borderLeft: '4px solid #10b981',
        },
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff',
        },
      },
      error: {
        style: {
          borderLeft: '4px solid #ef4444',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      },
      loading: {
        style: {
          borderLeft: '4px solid #0ea5e9',
        },
        iconTheme: {
          primary: '#0ea5e9',
          secondary: '#fff',
        },
      },
    }}
  />
);
