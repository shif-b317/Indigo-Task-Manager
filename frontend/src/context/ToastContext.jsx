import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { isMidnight } = useTheme();

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto ${
                isMidnight
                  ? 'bg-midnight-card border-midnight-light text-slate-100'
                  : 'bg-white border-vanilla-dark text-slate-800'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                {toast.type === 'error' && (
                  <XCircle className="w-5 h-5 text-rose-500" />
                )}
                {toast.type === 'info' && (
                  <Info className="w-5 h-5 text-sky-500" />
                )}
              </div>
              <div className="flex-grow text-sm font-medium pr-2">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`flex-shrink-0 rounded-lg p-0.5 transition-colors ${
                  isMidnight
                    ? 'hover:bg-midnight-light text-slate-400 hover:text-slate-200'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
