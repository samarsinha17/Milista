import React, { useState } from 'react';
import { Check, Trash2, Calendar, Clock, AlertTriangle, Tag, FileText } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDeleteTask(task.id);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const isDueToday = task.dueDate && !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString();

  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200'
  };

  const categoryColors = {
    Personal: 'bg-purple-100 text-purple-700',
    Work: 'bg-blue-100 text-blue-700',
    Shopping: 'bg-pink-100 text-pink-700',
    Health: 'bg-green-100 text-green-700',
    Learning: 'bg-indigo-100 text-indigo-700'
  };

  return (
    <div
      className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 transition-all duration-300 hover:shadow-xl hover:bg-white/90 ${
        isDeleting ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100'
      } ${task.completed ? 'opacity-75' : ''}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 hover:scale-110'
            }`}
          >
            {task.completed && <Check size={14} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold transition-all duration-200 cursor-pointer ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800 hover:text-purple-600'
                  }`}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {task.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${priorityColors[task.priority]}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${categoryColors[task.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}>
                    {task.category}
                  </span>

                  {task.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {task.dueDate && (
              <div className="flex items-center gap-2 mt-3">
                <Calendar size={14} className="text-gray-400" />
                <span
                  className={`text-sm font-medium ${
                    isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : 'text-gray-600'
                  }`}
                >
                  Due {formatDate(task.dueDate)}
                  {isOverdue && (
                    <span className="ml-2 inline-flex items-center gap-1 text-red-600">
                      <AlertTriangle size={12} />
                      Overdue
                    </span>
                  )}
                  {isDueToday && !isOverdue && (
                    <span className="ml-2 inline-flex items-center gap-1 text-orange-600">
                      <Clock size={12} />
                      Today
                    </span>
                  )}
                </span>
              </div>
            )}

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
                {task.description && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={14} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Description</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed pl-6">{task.description}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Created {formatTime(task.createdAt)}</span>
                  {task.completedAt && (
                    <span>Completed {formatTime(task.completedAt)}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}