import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Moon, Sun, Save, Loader2 } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfileState } = useAuth();
  const { isMidnight, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await api.put('/auth/profile', { name: name.trim(), email: email.trim() });
      if (response.data.success) {
        showToast('Profile updated successfully!', 'success');
        updateProfileState(response.data.data);
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!password || !newPassword || !confirmPassword) {
      showToast('All password fields are required.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    setIsChangingPass(true);
    try {
      const response = await api.put('/auth/profile', {
        name: user.name,
        email: user.email,
        currentPassword: password,
        password: newPassword,
      });

      if (response.data.success) {
        showToast('Password changed successfully!', 'success');
        updateProfileState(response.data.data);
        setPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to update password.', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className={`flex min-h-screen pb-20 md:pb-0 transition-colors duration-300 ${
      isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'
    }`}>
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">Settings</h1>
          <p className="text-xs opacity-75 mt-1">Configure profile settings and customization preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left panel: Info & Theme Toggle */}
          <div className="space-y-6 md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 border rounded-3xl shadow-sm text-center flex flex-col items-center ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center font-bold text-2xl shadow-inner mb-4 ${
                  isMidnight ? 'bg-midnight-light text-vanilla' : 'bg-vanilla text-midnight'
                }`}
              >
                {getInitials(user?.name)}
              </div>
              <h3 className="font-bold text-base">{user?.name}</h3>
              <p className="text-xs opacity-60 mt-0.5">{user?.email}</p>
            </motion.div>

            {/* Custom Theme selection */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 border rounded-2xl shadow-sm ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-3">
                Interface theme
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => !isMidnight && toggleTheme()}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                    isMidnight
                      ? 'bg-midnight-light/40 border-indigo-500/50 text-slate-100 font-semibold'
                      : 'border-slate-200 hover:border-slate-400 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Midnight Theme</span>
                  </div>
                  {isMidnight && <span className="text-[10px] uppercase font-bold text-indigo-500">Active</span>}
                </button>

                <button
                  onClick={() => isMidnight && toggleTheme()}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                    !isMidnight
                      ? 'bg-vanilla border-vanilla-dark text-slate-800 font-semibold'
                      : 'border-midnight-light hover:border-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Vanilla Theme</span>
                  </div>
                  {!isMidnight && <span className="text-[10px] uppercase font-bold text-slate-800">Active</span>}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right panel: forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 border rounded-3xl shadow-sm ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <h4 className="text-sm font-bold border-b border-inherit pb-3 mb-4">
                Profile Details
              </h4>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isMidnight
                            ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                            : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isMidnight
                            ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                            : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`flex items-center gap-1.5 font-semibold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 hover:scale-[1.01] ${
                      isMidnight
                        ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                        : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                    }`}
                  >
                    {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Change Password Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 border rounded-3xl shadow-sm ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <h4 className="text-sm font-bold border-b border-inherit pb-3 mb-4">
                Update Password
              </h4>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                        isMidnight
                          ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                          : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isMidnight
                            ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                            : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-40">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                          isMidnight
                            ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                            : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className={`flex items-center gap-1.5 font-semibold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all disabled:opacity-50 hover:scale-[1.01] ${
                      isMidnight
                        ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                        : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                    }`}
                  >
                    {isChangingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
