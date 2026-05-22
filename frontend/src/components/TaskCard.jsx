import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, ChevronRight, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { isMidnight } = useTheme();
  const navigate = useNavigate();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low':
      default:
        return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25';
      case 'In Progress':
        return 'text-sky-500 bg-sky-500/10 border-sky-500/25';
      case 'Pending':
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const formattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    return due < today;
  };

  // Subtask progress
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasksCount = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercentage = subtasksCount > 0 ? Math.round((completedSubtasksCount / subtasksCount) * 100) : 0;

  return (
    <motion.div
      layoutId={`task-card-${task._id}`}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`border rounded-2xl p-5 shadow-sm transition-all duration-300 relative flex flex-col justify-between h-full ${
        task.status === 'Completed' ? 'opacity-70' : ''
      } ${
        isMidnight
          ? 'bg-midnight-card border-midnight-light text-slate-100 hover:border-slate-500'
          : 'bg-white border-vanilla-dark text-slate-800 hover:border-slate-400'
      }`}
    >
      <div>
        {/* Header: Priority & Action buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 border rounded-full ${getPriorityStyle(task.priority)}`}>
            {task.priority} Priority
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className={`p-1.5 rounded-lg transition-colors ${
                isMidnight ? 'hover:bg-midnight-light text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className={`p-1.5 rounded-lg transition-colors text-rose-500 ${
                isMidnight ? 'hover:bg-rose-500/10' : 'hover:bg-rose-50'
              }`}
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-base mb-1.5 cursor-pointer hover:underline truncate ${
            task.status === 'Completed' ? 'line-through text-slate-500' : ''
          }`}
          onClick={() => navigate(`/tasks/${task._id}`)}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs opacity-70 mb-4 line-clamp-2 min-h-[2rem]">
          {task.description || 'No description provided.'}
        </p>

        {/* Subtask progress bar */}
        {subtasksCount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] opacity-75 mb-1">
              <span>Subtasks: {completedSubtasksCount}/{subtasksCount}</span>
              <span>{subtaskPercentage}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isMidnight ? 'bg-midnight-light' : 'bg-vanilla-dark/50'}`}>
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${subtaskPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Footer: Date & Status select */}
        <div className="flex items-center justify-between border-t border-dashed border-inherit pt-3 mt-2 text-xs">
          {/* Due date info */}
          <div
            className={`flex items-center gap-1.5 ${
              isOverdue(task.dueDate, task.status)
                ? 'text-rose-500 font-medium'
                : 'opacity-70'
            }`}
          >
            {isOverdue(task.dueDate, task.status) ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span className="text-[10px]">{formattedDate(task.dueDate)}</span>
          </div>

          {/* Quick status pill drop down */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className={`text-[10px] font-semibold px-2.5 py-1 border rounded-lg cursor-pointer outline-none transition-colors ${getStatusColor(
              task.status
            )} ${
              isMidnight
                ? 'bg-midnight-dark border-transparent text-slate-300'
                : 'bg-vanilla-light border-transparent text-slate-700'
            }`}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Details Arrow Link */}
        <button
          onClick={() => navigate(`/tasks/${task._id}`)}
          className={`w-full flex items-center justify-center gap-1 text-[10px] font-medium mt-3 transition-opacity opacity-60 hover:opacity-100 ${
            isMidnight ? 'text-vanilla' : 'text-midnight'
          }`}
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskCard;
