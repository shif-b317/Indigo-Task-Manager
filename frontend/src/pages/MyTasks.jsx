import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { useToast } from '../context/ToastContext';
import { initiateSocketConnection } from '../services/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, LayoutGrid, List, Plus, Loader2, Info } from 'lucide-react';

const MyTasks = () => {
  const { user } = useAuth();
  const { isMidnight } = useTheme();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, createdAt
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [viewMode, setViewMode] = useState('grid'); // grid, kanban

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error(error);
      showToast('Could not load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Socket listeners for real-time task sync
    const socket = initiateSocketConnection(user?._id);
    if (socket) {
      socket.on('task_created', () => fetchTasks());
      socket.on('task_updated', () => fetchTasks());
      socket.on('task_deleted', () => fetchTasks());
    }

    return () => {
      if (socket) {
        socket.off('task_created');
        socket.off('task_updated');
        socket.off('task_deleted');
      }
    };
  }, [user?._id]);

  // Handle status quick change from card selector
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Find the task locally to update state instantly for visual smoothness
      const originalTasks = [...tasks];
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );

      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      if (!response.data.success) {
        setTasks(originalTasks);
        showToast('Failed to update status.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error updating status.', 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      if (response.data.success) {
        showToast('Task deleted successfully.', 'success');
        setTasks(tasks.filter((t) => t._id !== taskId));
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to delete task.', 'error');
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Edit flow
        const response = await api.put(`/tasks/${editingTask._id}`, taskData);
        if (response.data.success) {
          showToast('Task updated successfully.', 'success');
          setTasks((prev) =>
            prev.map((t) => (t._id === editingTask._id ? response.data.data : t))
          );
        }
      } else {
        // Create flow
        const response = await api.post('/tasks', taskData);
        if (response.data.success) {
          showToast('Task created successfully.', 'success');
          setTasks((prev) => [response.data.data, ...prev]);
        }
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to save task.', 'error');
    }
  };

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Local sorting and filtering mapping
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Sort mappings
    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === 'dueDate') {
        valA = new Date(a.dueDate || 0);
        valB = new Date(b.dueDate || 0);
      } else if (sortBy === 'priority') {
        const pMap = { High: 3, Medium: 2, Low: 1 };
        valA = pMap[a.priority] || 0;
        valB = pMap[b.priority] || 0;
      } else {
        // Default: createdAt
        valA = new Date(a.createdAt || 0);
        valB = new Date(b.createdAt || 0);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, searchQuery, sortBy, sortOrder]);

  // Segment tasks for Kanban columns
  const kanbanColumns = useMemo(() => {
    return {
      Pending: filteredAndSortedTasks.filter((t) => t.status === 'Pending'),
      'In Progress': filteredAndSortedTasks.filter((t) => t.status === 'In Progress'),
      Completed: filteredAndSortedTasks.filter((t) => t.status === 'Completed'),
    };
  }, [filteredAndSortedTasks]);

  return (
    <div className={`flex min-h-screen pb-20 md:pb-0 transition-colors duration-300 ${
      isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'
    }`}>
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans">My Tasks</h1>
            <p className="text-xs opacity-75 mt-1">Manage and track all details of your activities.</p>
          </div>
          <button
            onClick={handleCreateClick}
            className={`flex items-center justify-center gap-2 text-xs font-semibold py-3 px-5 rounded-2xl shadow-md transition-all hover:scale-[1.02] ${
              isMidnight
                ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className={`p-4 border rounded-2xl shadow-sm mb-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center ${
          isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
        }`}>
          {/* Search box */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search task title, notes..."
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                isMidnight
                  ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                  : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
              }`}
            />
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Status pills */}
            <div className="flex items-center gap-1 bg-inherit border border-slate-500/20 p-1 rounded-xl">
              {['All', 'Pending', 'In Progress', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                    statusFilter === s
                      ? isMidnight
                        ? 'bg-vanilla text-midnight font-semibold shadow-sm'
                        : 'bg-midnight text-vanilla font-semibold shadow-sm'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl border text-xs outline-none transition-colors cursor-pointer ${
                isMidnight
                  ? 'bg-midnight-dark border-midnight-light text-slate-300'
                  : 'bg-vanilla-light border-vanilla-dark text-slate-700'
              }`}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}
              className={`px-3 py-2 rounded-xl border text-xs outline-none transition-colors cursor-pointer ${
                isMidnight
                  ? 'bg-midnight-dark border-midnight-light text-slate-300'
                  : 'bg-vanilla-light border-vanilla-dark text-slate-700'
              }`}
            >
              <option value="dueDate-asc">Due Date (Soonest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="createdAt-desc">Created (Newest)</option>
              <option value="createdAt-asc">Created (Oldest)</option>
            </select>

            {/* View Mode toggles */}
            <div className="flex items-center gap-1 border border-slate-500/20 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? isMidnight
                      ? 'bg-vanilla text-midnight shadow-sm'
                      : 'bg-midnight text-vanilla shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Grid layout"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'kanban'
                    ? isMidnight
                      ? 'bg-vanilla text-midnight shadow-sm'
                      : 'bg-midnight text-vanilla shadow-sm'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Kanban Board"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className={`p-12 border border-dashed rounded-3xl text-center flex flex-col items-center justify-center flex-grow ${
            isMidnight ? 'border-midnight-light' : 'border-vanilla-dark'
          }`}>
            <div className="p-4 rounded-full bg-slate-500/10 mb-4 text-slate-400">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">No Tasks Found</h3>
            <p className="text-xs opacity-60 max-w-xs mb-6">
              There are no tasks matching your filters. Create a new task or reset the filters to see results.
            </p>
            <button
              onClick={handleCreateClick}
              className={`text-xs font-semibold py-2.5 px-5 rounded-xl ${
                isMidnight ? 'bg-vanilla text-midnight' : 'bg-midnight text-vanilla'
              }`}
            >
              Add New Task
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Layout */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Kanban Board Layout */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow items-start">
            {['Pending', 'In Progress', 'Completed'].map((colName) => {
              const colTasks = kanbanColumns[colName];
              return (
                <div
                  key={colName}
                  className={`p-4 border rounded-2xl shadow-inner flex flex-col max-h-[75vh] ${
                    isMidnight ? 'bg-midnight-dark/50 border-midnight-light' : 'bg-vanilla/10 border-vanilla-dark'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4 border-b border-dashed border-inherit pb-2 px-1">
                    <span className="font-semibold text-xs uppercase tracking-wider">{colName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      colName === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : colName === 'In Progress'
                        ? 'bg-sky-500/10 text-sky-500'
                        : 'bg-slate-400/10 text-slate-400'
                    }`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List inside Column */}
                  <div className="space-y-4 overflow-y-auto flex-grow pr-1 py-1">
                    <AnimatePresence mode="popLayout">
                      {colTasks.map((task) => (
                        <motion.div
                          key={task._id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {colTasks.length === 0 && (
                      <p className="text-[10px] opacity-40 italic text-center py-8">
                        No tasks in this column.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Task Modal for Create/Edit */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default MyTasks;
