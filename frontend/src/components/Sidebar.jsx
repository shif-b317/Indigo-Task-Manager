import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Sun, Moon, Layers } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isMidnight, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
    { to: '/profile', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 min-h-screen border-r transition-all duration-300 ${
          isMidnight
            ? 'bg-midnight border-midnight-light text-slate-200'
            : 'bg-white border-vanilla-dark text-slate-800'
        }`}
      >
        {/* Header/Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-inherit">
          <div
            className={`p-2 rounded-xl flex items-center justify-center ${
              isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
            }`}
          >
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-semibold text-base tracking-wider font-sans">
            INDIGO<span className="font-light opacity-80">TASK</span>
          </span>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b border-inherit">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${
                isMidnight
                  ? 'bg-midnight-light text-vanilla'
                  : 'bg-vanilla text-midnight'
              }`}
            >
              {getInitials(user?.name)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-medium text-sm truncate">{user?.name}</h4>
              <p className="text-xs opacity-60 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? isMidnight
                        ? 'bg-vanilla text-midnight shadow-md'
                        : 'bg-midnight text-vanilla shadow-md'
                      : isMidnight
                      ? 'hover:bg-midnight-light/50 text-slate-400 hover:text-slate-100'
                      : 'hover:bg-vanilla-light text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Theme and Logout controls */}
        <div className="p-4 border-t border-inherit space-y-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              isMidnight
                ? 'hover:bg-midnight-light/50 text-slate-400 hover:text-slate-100'
                : 'hover:bg-vanilla-light text-slate-500 hover:text-slate-800'
            }`}
          >
            {isMidnight ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-rose-500 ${
              isMidnight ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around h-16 transition-all duration-300 shadow-2xl ${
          isMidnight
            ? 'bg-midnight border-midnight-light text-slate-200'
            : 'bg-white border-vanilla-dark text-slate-800'
        }`}
      >
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-20 h-full gap-1 text-[10px] font-medium transition-all ${
                  isActive
                    ? 'text-indigo-500 scale-105'
                    : isMidnight
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
        
        {/* Toggle Theme icon on mobile footer */}
        <button
          onClick={toggleTheme}
          className={`flex flex-col items-center justify-center w-20 h-full gap-1 text-[10px] font-medium transition-all ${
            isMidnight ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {isMidnight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>Theme</span>
        </button>

        {/* Mobile Log Out Icon */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-20 h-full gap-1 text-[10px] font-medium text-rose-500"
        >
          <LogOut className="w-5 h-5" />
          <span>Exit</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
