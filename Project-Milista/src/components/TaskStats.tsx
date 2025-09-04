import React from 'react';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { TaskStats as TaskStatsType } from '../types/Task';

interface TaskStatsProps {
  stats: TaskStatsType;
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round(completionRate)}% complete</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.dueToday}</p>
            <p className="text-sm text-gray-600">Due Today</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </div>
      </div>
    </div>
  );
}