import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, Layers, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const { login } = useAuth();
  const { isMidnight } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password.trim()) {
      setValidationError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password.trim());
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setValidationError(result.error);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden ${
        isMidnight ? 'bg-midnight-dark' : 'bg-vanilla-light'
      }`}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-orange-300/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className={`w-full max-w-md border rounded-3xl shadow-xl p-8 relative z-10 transition-all ${
          isMidnight ? 'bg-midnight border-midnight-light text-slate-100' : 'bg-white border-vanilla-dark text-slate-800'
        }`}
      >
        {/* Brand logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-wider font-sans">
              INDIGO<span className="font-light opacity-80">TASK</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold">Welcome Back</h2>
          <p className="text-xs opacity-60 mt-1">Log in to manage your productivity goals.</p>
        </div>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl text-xs font-medium text-rose-500 bg-rose-500/10 border border-rose-500/20 text-center">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors ${
                  isMidnight
                    ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                    : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                }`}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-50">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors ${
                  isMidnight
                    ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                    : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center opacity-50 hover:opacity-85 transition-opacity"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-5 rounded-2xl transition-all shadow-md mt-6 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${
              isMidnight
                ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                : 'bg-midnight text-vanilla hover:bg-midnight-light'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs opacity-70 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="underline font-semibold hover:opacity-100 transition-opacity">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
