import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Zap, RefreshCw, BarChart2, Layers } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { isMidnight } = useTheme();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
  };

  const features = [
    {
      icon: Zap,
      title: 'Minimal & Lightweight',
      desc: 'No heavy dashboards. Focus on your priorities with a smooth, distraction-free interface.',
    },
    {
      icon: RefreshCw,
      title: 'Real-Time Sync',
      desc: 'Open the app on multiple tabs. Your tasks stay synced instantly via WebSockets.',
    },
    {
      icon: BarChart2,
      title: 'Actionable Insights',
      desc: 'Understand your completion rates and prioritize effectively using elegant status graphics.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      desc: 'Rest easy knowing your details are fully secure, guarded by JWT and hashed passwords.',
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative overflow-hidden flex flex-col justify-between ${
        isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'
      }`}
    >
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-300/5 blur-[120px] pointer-events-none" />

      <div>
        <Navbar />

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Tagline */}
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium tracking-wide mb-6 ${
                isMidnight
                  ? 'bg-midnight border-midnight-light text-vanilla'
                  : 'bg-white border-vanilla-dark text-midnight'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Simple. Beautiful. Dynamic.</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1] mb-6 font-sans"
            >
              Organize your tasks with{' '}
              <span className={isMidnight ? 'text-vanilla' : 'text-indigo-600'}>IndigoTask</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg opacity-75 max-w-xl leading-relaxed mb-10"
            >
              A premium, minimalist task manager designed to keep you focused.
              Track priorities, manage subtasks, and watch your stats update in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-20">
              <button
                onClick={handleCTA}
                className={`flex items-center gap-2 text-sm font-semibold py-3.5 px-8 rounded-2xl transition-all shadow-lg hover:scale-[1.03] ${
                  isMidnight
                    ? 'bg-vanilla text-midnight-dark hover:bg-vanilla-dark'
                    : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                }`}
              >
                {user ? 'Open Dashboard' : 'Get Started for Free'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className={`text-sm font-medium py-3.5 px-8 rounded-2xl border transition-all ${
                  isMidnight
                    ? 'border-midnight-light hover:bg-midnight-light text-slate-300'
                    : 'border-vanilla-dark hover:bg-vanilla-dark text-slate-700'
                }`}
              >
                Learn More
              </a>
            </motion.div>

            {/* Live Interactive Mockup */}
            <motion.div
              variants={itemVariants}
              id="preview"
              className={`w-full max-w-4xl border rounded-3xl shadow-2xl p-4 sm:p-6 transition-all relative overflow-hidden ${
                isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
              }`}
            >
              {/* Header representing mockup tab */}
              <div className="flex items-center justify-between border-b border-inherit pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs opacity-40 ml-2 select-none font-mono">indigotask.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-5 w-20 rounded-md skeleton`} />
                </div>
              </div>

              {/* Inside Mockup Body */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
                {/* Mockup Sidebar */}
                <div className="hidden md:flex flex-col gap-3 border-r border-inherit pr-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">IT</div>
                    <span className="text-xs font-semibold">IndigoTask</span>
                  </div>
                  <div className={`h-7 rounded-lg ${isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla-light'} px-3 flex items-center text-xs font-medium`}>
                    Dashboard
                  </div>
                  <div className="h-7 rounded-lg hover:bg-slate-500/10 px-3 flex items-center text-xs font-medium opacity-60">
                    My Tasks
                  </div>
                  <div className="h-7 rounded-lg hover:bg-slate-500/10 px-3 flex items-center text-xs font-medium opacity-60">
                    Settings
                  </div>
                </div>

                {/* Mockup Dashboard Content */}
                <div className="md:col-span-3 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Welcome back, Sarah!</h3>
                      <p className="text-xs opacity-60">You have completed 4/5 of your goals today.</p>
                    </div>
                    <div className={`h-9 w-28 rounded-xl ${isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'} text-xs font-semibold flex items-center justify-center`}>
                      + New Task
                    </div>
                  </div>

                  {/* Mockup Statistics Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {['Total Tasks', 'Completed', 'Progress'].map((stat, i) => (
                      <div
                        key={stat}
                        className={`p-4 rounded-2xl border ${
                          isMidnight ? 'bg-midnight-dark border-midnight-light' : 'bg-vanilla-light border-vanilla-dark'
                        }`}
                      >
                        <span className="text-[10px] opacity-60 block uppercase tracking-wider">{stat}</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-bold">{i === 0 ? '12' : i === 1 ? '9' : '75%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mockup Tasks list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold opacity-60">Recent Tasks</h4>
                    {[
                      { title: 'Launch Landing Page UI design', priority: 'High', status: 'In Progress' },
                      { title: 'Connect MongoDB database schema', priority: 'Medium', status: 'Completed' },
                    ].map((task, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isMidnight ? 'bg-midnight border-midnight-light' : 'bg-vanilla-light border-vanilla-dark'
                        } ${task.status === 'Completed' ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${task.status === 'Completed' ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-400'}`}>
                            {task.status === 'Completed' && '✓'}
                          </span>
                          <span className={`text-xs font-medium ${task.status === 'Completed' ? 'line-through' : ''}`}>{task.title}</span>
                        </div>
                        <span className={`text-[9px] font-semibold px-2 py-0.5 border rounded-full ${task.priority === 'High' ? 'text-rose-500 bg-rose-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <section id="features" className={`py-24 border-t ${isMidnight ? 'border-midnight-light bg-midnight-dark/40' : 'border-vanilla-dark bg-vanilla/10'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 font-sans">Crafted with Visual and Logic Polish</h2>
              <p className="text-sm opacity-70">
                Experience productivity without complexity. Built using tailored components matching Midnight Indigo and Vanilla Cream colors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border transition-all hover-lift ${
                      isMidnight
                        ? 'bg-midnight-card border-midnight-light text-slate-100 hover:border-slate-500'
                        : 'bg-white border-vanilla-dark text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl inline-flex items-center justify-center mb-5 ${
                        isMidnight ? 'bg-midnight-light text-vanilla' : 'bg-vanilla text-midnight'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 font-sans">{feature.title}</h3>
                    <p className="text-xs opacity-75 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className={`py-8 text-center border-t text-xs ${
          isMidnight ? 'bg-midnight border-midnight-light opacity-80' : 'bg-vanilla-light border-vanilla-dark opacity-90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold tracking-widest font-sans text-[10px]">INDIGOTASK &copy; 2026</span>
          </div>
          <p className="opacity-60">Created with premium aesthetics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
