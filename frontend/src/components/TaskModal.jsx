import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const { isMidnight } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [notes, setNotes] = useState('');

  // Hydrate fields if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setStatus(task.status || 'Pending');
      setNotes(task.notes || '');
      
      if (task.dueDate) {
        // Format ISO string to YYYY-MM-DD
        setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }

      setSubtasks(task.subtasks ? [...task.subtasks] : []);
    } else {
      // Clear fields for new task
      setTitle('');
      setDescription('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('Pending');
      setSubtasks([]);
      setNotes('');
    }
  }, [task, isOpen]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleToggleSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status,
      subtasks,
      notes: notes.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] z-10 border ${
              isMidnight
                ? 'bg-midnight-card border-midnight-light text-slate-100'
                : 'bg-white border-vanilla-dark text-slate-800'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-inherit flex items-center justify-between">
              <h2 className="text-lg font-bold font-sans">
                {task ? 'Edit Task' : 'Create Task'}
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors ${
                  isMidnight ? 'hover:bg-midnight-light text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Review project roadmap..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  placeholder="Outline key milestones and tasks..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                  }`}
                />
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                        : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                        : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Pending', 'In Progress', 'Completed'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                        status === s
                          ? isMidnight
                            ? 'bg-vanilla text-midnight border-transparent font-semibold shadow-sm'
                            : 'bg-midnight text-vanilla-light border-transparent font-semibold shadow-sm'
                          : isMidnight
                          ? 'border-midnight-light text-slate-400 bg-midnight-dark hover:border-slate-500'
                          : 'border-vanilla-dark text-slate-500 bg-vanilla-light hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="pt-2 border-t border-inherit border-dashed">
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Subtasks checklist
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add checklist item..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                    className={`flex-grow px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-1 transition-colors ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                        : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
                      isMidnight
                        ? 'border-midnight-light hover:bg-midnight-light text-vanilla'
                        : 'border-vanilla-dark hover:bg-vanilla-dark text-midnight'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {subtasks.map((st, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        isMidnight
                          ? 'bg-midnight-dark/40 border-midnight-light/50'
                          : 'bg-vanilla-light border-vanilla-dark/40'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(i)}
                        className="flex items-center gap-2 flex-grow text-left cursor-pointer"
                      >
                        <CheckCircle2
                          className={`w-4 h-4 transition-colors flex-shrink-0 ${
                            st.completed ? 'text-emerald-500' : 'text-slate-400'
                          }`}
                        />
                        <span className={st.completed ? 'line-through opacity-50' : ''}>
                          {st.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(i)}
                        className="text-rose-500 hover:text-rose-600 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {subtasks.length === 0 && (
                    <p className="text-[10px] opacity-40 italic text-center py-2">
                      No subtasks added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Detailed Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="2"
                  placeholder="Additional pointers, login credentials or resources..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla focus:ring-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight focus:ring-midnight text-slate-800'
                  }`}
                />
              </div>
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-inherit flex items-center justify-end gap-3 bg-inherit">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors border ${
                  isMidnight
                    ? 'border-midnight-light hover:bg-midnight-light text-slate-300'
                    : 'border-vanilla-dark hover:bg-vanilla-dark text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all hover:scale-[1.02] ${
                  isMidnight
                    ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                    : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                }`}
              >
                {task ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
