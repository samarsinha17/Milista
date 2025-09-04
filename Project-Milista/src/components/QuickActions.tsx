import React from 'react';
import { CheckCircle, Trash2, Download, Upload } from 'lucide-react';
import { Task } from '../types/Task';

interface QuickActionsProps {
  tasks: Task[];
  onCompleteAll: () => void;
  onDeleteCompleted: () => void;
  onExportTasks: () => void;
  onImportTasks: (tasks: Task[]) => void;
}

export function QuickActions({ 
  tasks, 
  onCompleteAll, 
  onDeleteCompleted, 
  onExportTasks,
  onImportTasks 
}: QuickActionsProps) {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target?.result as string);
          onImportTasks(importedTasks);
        } catch (error) {
          alert('Invalid file format. Please select a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/30 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={onCompleteAll}
          disabled={incompleteTasks.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <CheckCircle size={16} />
          Complete All
        </button>

        <button
          onClick={onDeleteCompleted}
          disabled={completedTasks.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <Trash2 size={16} />
          Clear Done
        </button>

        <button
          onClick={onExportTasks}
          disabled={tasks.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          <Download size={16} />
          Export
        </button>

        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 cursor-pointer transition-all duration-200 font-medium">
          <Upload size={16} />
          Import
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}