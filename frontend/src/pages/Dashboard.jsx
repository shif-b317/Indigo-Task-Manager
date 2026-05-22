import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import { useToast } from '../context/ToastContext';
import { initiateSocketConnection, getSocket } from '../services/socket';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, Plus, Award, AlertCircle, BarChart3, ArrowRight, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { isMidnight } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/tasks/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching statistics', error);
      showToast('Could not load dashboard stats.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Setup Socket connection and listeners
    const socket = initiateSocketConnection(user?._id);
    if (socket) {
      socket.on('task_created', () => fetchStats());
      socket.on('task_updated', () => fetchStats());
      socket.on('task_deleted', () => fetchStats());
    }

    return () => {
      if (socket) {
        socket.off('task_created');
        socket.off('task_updated');
        socket.off('task_deleted');
      }
    };
  }, [user?._id]);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      if (response.data.success) {
        showToast('Task created successfully!', 'success');
        setIsModalOpen(false);
        fetchStats();
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to create task.', 'error');
    }
  };

  if (loading) {
    return (
      <div className={`flex min-h-screen ${isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'}`}>
        <Sidebar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  // SVG stats gauge details
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((stats?.completionRate || 0) / 100) * circumference;

  return (
    <div className={`flex min-h-screen pb-20 md:pb-0 transition-colors duration-300 ${
      isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'
    }`}>
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">
              Welcome back, <span className={isMidnight ? 'text-vanilla font-bold' : 'text-indigo-600 font-bold'}>{user?.name}</span>
            </h1>
            <p className="text-xs opacity-75 mt-1">Here is a quick overview of your productivity today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center justify-center gap-2 text-xs font-semibold py-3 px-5 rounded-2xl shadow-md transition-all hover:scale-[1.02] ${
                isMidnight
                  ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                  : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Stats Summary Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Numeric Statistics widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total tasks', val: stats?.totalTasks, icon: CheckSquare, color: 'text-indigo-500 bg-indigo-500/10' },
                { label: 'Completed', val: stats?.completedTasks, icon: Award, color: 'text-emerald-500 bg-emerald-500/10' },
                { label: 'Pending', val: stats?.pendingTasks, icon: Clock, color: 'text-slate-400 bg-slate-400/10' },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    variants={itemVariants}
                    className={`p-5 border rounded-2xl shadow-sm transition-all ${
                      isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold tracking-wider opacity-60">
                        {card.label}
                      </span>
                      <div className={`p-2 rounded-xl ${card.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold tracking-tight font-sans">
                        {card.val || 0}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick overview / progress details */}
            <motion.div
              variants={itemVariants}
              className={`p-6 border rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-8 ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center flex-shrink-0">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Background track circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className={isMidnight ? 'stroke-midnight-light' : 'stroke-vanilla-dark/40'}
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Animated indicator circle */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-indigo-500"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold tracking-tight font-sans">
                    {stats?.completionRate || 0}%
                  </span>
                  <span className="text-[9px] uppercase font-semibold opacity-60 tracking-wider">
                    Done
                  </span>
                </div>
              </div>

              {/* Progress Text */}
              <div className="flex-grow space-y-3 text-center md:text-left">
                <h3 className="font-bold text-lg">Goal Completion Rate</h3>
                <p className="text-xs opacity-75 leading-relaxed max-w-sm">
                  You have finalized {stats?.completedTasks || 0} out of your {stats?.totalTasks || 0} registered tasks. Keep pushing forward to close out your pending goals!
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>{stats?.completedTasks || 0} Finished</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span>{stats?.inProgressTasks || 0} In Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>{stats?.pendingTasks || 0} Pending</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Redirect Row */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/tasks')}
              className={`p-5 border rounded-2xl shadow-sm cursor-pointer transition-all hover:scale-[1.005] group flex items-center justify-between ${
                isMidnight
                  ? 'bg-midnight-card border-midnight-light hover:border-slate-500'
                  : 'bg-white border-vanilla-dark hover:border-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isMidnight ? 'bg-midnight-light text-vanilla' : 'bg-vanilla text-midnight'}`}>
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">View full tasks board</h4>
                  <p className="text-[10px] opacity-60">Manage lists, sort by priority and status.</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
            </motion.div>
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            {/* Due Today Widget */}
            <motion.div
              variants={itemVariants}
              className={`p-5 border rounded-2xl shadow-sm ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <div className="flex items-center gap-2 text-rose-500 mb-3">
                <AlertCircle className="w-4 h-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">Due Today</h4>
              </div>
              <p className="text-3xl font-extrabold tracking-tight font-sans">
                {stats?.tasksDueToday || 0}
              </p>
              <p className="text-[10px] opacity-60 mt-1">
                {stats?.tasksDueToday > 0 ? 'Be sure to complete these tasks before the day ends.' : 'No tasks scheduled for today.'}
              </p>
            </motion.div>

            {/* Recent Activity feed */}
            <motion.div
              variants={itemVariants}
              className={`p-5 border rounded-2xl shadow-sm flex flex-col justify-between ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              <div className="mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {stats?.recentActivity?.map((activity) => (
                    <div
                      key={activity._id}
                      onClick={() => navigate(`/tasks/${activity._id}`)}
                      className={`pb-3 border-b border-inherit last:border-0 last:pb-0 cursor-pointer group flex items-start gap-3`}
                    >
                      <div className="flex-grow overflow-hidden">
                        <span className="text-xs font-medium group-hover:underline truncate block">
                          {activity.title}
                        </span>
                        <span className="text-[9px] opacity-50 block mt-0.5">
                          Updated {new Date(activity.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                          activity.status === 'Completed'
                            ? 'text-emerald-500 bg-emerald-500/10'
                            : activity.status === 'In Progress'
                            ? 'text-sky-500 bg-sky-500/10'
                            : 'text-slate-400 bg-slate-400/10'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                  {(!stats?.recentActivity || stats?.recentActivity.length === 0) && (
                    <p className="text-xs opacity-40 italic text-center py-4">No recent task logs.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Task Modal for Quick Create */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;
