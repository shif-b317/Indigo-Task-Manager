import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Sun, Moon, Layers } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { isMidnight, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className={`sticky top-0 z-40 w-full border-b transition-all duration-300 backdrop-blur-md ${
        isMidnight
          ? 'bg-midnight-dark/80 border-midnight-light text-slate-100'
          : 'bg-vanilla-light/80 border-vanilla-dark text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-wider font-sans">
              INDIGO<span className="font-light opacity-80">TASK</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Features
            </a>
            <a
              href="#preview"
              className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity"
            >
              Interface
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isMidnight
                  ? 'border-midnight-light hover:bg-midnight-light text-vanilla'
                  : 'border-vanilla-dark hover:bg-vanilla-dark text-midnight'
              }`}
              aria-label="Toggle Theme"
            >
              {isMidnight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className={`text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md hover:scale-[1.02] ${
                  isMidnight
                    ? 'bg-vanilla text-midnight-dark hover:bg-vanilla-dark'
                    : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                }`}
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={`text-sm font-semibold py-2.5 px-5 rounded-xl transition-all shadow-md hover:scale-[1.02] ${
                    isMidnight
                      ? 'bg-vanilla text-midnight-dark hover:bg-vanilla-dark'
                      : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                isMidnight
                  ? 'border-midnight-light text-vanilla'
                  : 'border-vanilla-dark text-midnight'
              }`}
              aria-label="Toggle Theme"
            >
              {isMidnight ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isMidnight ? 'hover:bg-midnight-light' : 'hover:bg-vanilla-dark'
              }`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className={`md:hidden px-4 pt-2 pb-4 border-t space-y-3 transition-all ${
            isMidnight ? 'bg-midnight-dark border-midnight-light' : 'bg-vanilla-light border-vanilla-dark'
          }`}
        >
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium opacity-80 hover:opacity-100"
          >
            Features
          </a>
          <a
            href="#preview"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium opacity-80 hover:opacity-100"
          >
            Interface
          </a>
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className={`w-full text-center font-semibold py-2.5 rounded-xl ${
                isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
              }`}
            >
              Go to Dashboard
            </button>
          ) : (
            <div className="pt-2 border-t border-dashed space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 text-base font-medium opacity-80"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className={`block text-center font-semibold py-2.5 rounded-xl ${
                  isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
                }`}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
