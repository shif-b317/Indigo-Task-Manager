import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, AlertCircle, Plus, Trash2, CheckCircle2, ChevronRight, Save, Loader2 } from 'lucide-react';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const { isMidnight } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Edit states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      if (response.data.success) {
        const t = response.data.data;
        setTask(t);
        setTitle(t.title || '');
        setDescription(t.description || '');
        setPriority(t.priority || 'Medium');
        setStatus(t.status || 'Pending');
        setNotes(t.notes || '');
        setSubtasks(t.subtasks || []);
        if (t.dueDate) {
          setDueDate(new Date(t.dueDate).toISOString().split('T')[0]);
        }
      }
    } catch (error) {
      console.error(error);
      showToast('Could not load task details.', 'error');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    setIsSaving(true);
    try {
      const response = await api.put(`/tasks/${id}`, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        status,
        notes: notes.trim(),
        subtasks,
      });

      if (response.data.success) {
        showToast('Changes saved successfully!', 'success');
        setTask(response.data.data);
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to save changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const updated = [...subtasks, { title: newSubtaskTitle.trim(), completed: false }];
    setSubtasks(updated);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.data.success) {
        showToast('Task deleted successfully.', 'success');
        navigate('/tasks');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to delete task.', 'error');
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

  return (
    <div className={`flex min-h-screen pb-20 md:pb-0 transition-colors duration-300 ${
      isMidnight ? 'bg-midnight-dark text-slate-100' : 'bg-vanilla-light text-slate-800'
    }`}>
      <Sidebar />

      <main className="flex-grow p-6 md:p-10 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-6 transition-opacity font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        {/* Task Editor Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-3xl shadow-lg p-6 md:p-8 space-y-6 ${
            isMidnight ? 'bg-midnight-card border-midnight-light' : 'bg-white border-vanilla-dark'
          }`}
        >
          {/* Header section with delete action */}
          <div className="flex items-center justify-between border-b border-inherit pb-4">
            <h2 className="text-xl font-bold font-sans">Task Details</h2>
            <button
              onClick={handleDeleteTask}
              className={`text-xs font-semibold py-2 px-4 rounded-xl text-rose-500 transition-colors ${
                isMidnight ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
              }`}
            >
              Delete Task
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side details */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors resize-none ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                        : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs outline-none transition-colors cursor-pointer ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light text-slate-300'
                        : 'bg-vanilla-light border-vanilla-dark text-slate-700'
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Status
                </label>
                <div className="flex gap-2">
                  {['Pending', 'In Progress', 'Completed'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`flex-grow py-2 rounded-xl text-[10px] font-semibold border transition-all ${
                        status === s
                          ? isMidnight
                            ? 'bg-vanilla text-midnight border-transparent'
                            : 'bg-midnight text-vanilla-light border-transparent'
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

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Detailed Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Paste login details, checklists, URLs..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors resize-none ${
                    isMidnight
                      ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                      : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Right side subtasks */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1.5">
                  Subtask Checklist
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add checklist subtask..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                    className={`flex-grow px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                      isMidnight
                        ? 'bg-midnight-dark border-midnight-light focus:border-vanilla text-slate-100'
                        : 'bg-vanilla-light border-vanilla-dark focus:border-midnight text-slate-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className={`px-3 py-2 rounded-xl border flex items-center justify-center transition-colors ${
                      isMidnight
                        ? 'border-midnight-light hover:bg-midnight-light text-vanilla'
                        : 'border-vanilla-dark hover:bg-vanilla-dark text-midnight'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {subtasks.map((st, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                          isMidnight
                            ? 'bg-midnight-dark/40 border-midnight-light/50'
                            : 'bg-vanilla-light border-vanilla-dark/40'
                        }`}
                      >
                        <div
                          onClick={() => handleToggleSubtask(i)}
                          className="flex items-center gap-2 flex-grow text-left cursor-pointer select-none"
                        >
                          <CheckCircle2
                            className={`w-4.5 h-4.5 transition-colors flex-shrink-0 ${
                              st.completed ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                          />
                          <span className={st.completed ? 'line-through opacity-50' : 'font-medium'}>
                            {st.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(i)}
                          className="text-rose-500 hover:text-rose-600 ml-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {subtasks.length === 0 && (
                    <p className="text-[10px] opacity-40 italic text-center py-8">
                      No checklist tasks added yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-6 border-t border-dashed border-inherit flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-2xl transition-all shadow-md hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none ${
                    isMidnight
                      ? 'bg-vanilla text-midnight hover:bg-vanilla-dark'
                      : 'bg-midnight text-vanilla-light hover:bg-midnight-light'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default TaskDetailsPage;
