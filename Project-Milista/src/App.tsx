import React, { useState, useEffect } from 'react';
import { CheckSquare, Moon, Sun, Sparkles } from 'lucide-react';
import { Task } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskSection } from './components/TaskSection';
import { TaskStats } from './components/TaskStats';
import { QuickActions } from './components/QuickActions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTaskStats } from './hooks/useTaskStats';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('dark-mode', false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const stats = useTaskStats(tasks);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addTask = (
    title: string, 
    description?: string, 
    dueDate?: string, 
    priority: 'low' | 'medium' | 'high' = 'medium',
    category: string = 'Personal',
    tags: string[] = []
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate,
      priority,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      tags,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined
            } 
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeAllTasks = () => {
    setTasks(prev =>
      prev.map(task =>
        task.completed 
          ? task 
          : { ...task, completed: true, completedAt: new Date().toISOString() }
      )
    );
  };

  const deleteCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todo-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importTasks = (importedTasks: Task[]) => {
    setTasks(prev => [...prev, ...importedTasks]);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTodayDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-100 via-pink-50 to-emerald-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 rounded-2xl shadow-lg">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-emerald-600 bg-clip-text text-transparent">
                  Milista
                </h1>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getGreeting()}! Let's be productive today
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300' 
                  : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Stay organized, stay ahead
            </p>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
        </header>

        {/* Task Statistics */}
        <TaskStats stats={stats} />

        {/* Quick Actions */}
        {tasks.length > 0 && (
          <QuickActions
            tasks={tasks}
            onCompleteAll={completeAllTasks}
            onDeleteCompleted={deleteCompletedTasks}
            onExportTasks={exportTasks}
            onImportTasks={importTasks}
          />
        )}

        {/* Task Form */}
        <TaskForm onAddTask={addTask} />

        {/* Active Tasks */}
        <TaskSection
          title="Active Tasks"
          tasks={activeTasks}
          onToggleComplete={toggleTaskComplete}
          onDeleteTask={deleteTask}
          emptyMessage="No active tasks. Time to add some goals! 🎯"
          showFilters={true}
        />

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <TaskSection
            title="Completed Tasks"
            tasks={completedTasks}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
            emptyMessage="No completed tasks yet."
          />
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8">
          <div className={`inline-block rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700/30' 
              : 'bg-white/70 backdrop-blur-sm border-white/30'
          }`}>
            <div className="space-y-2">
              <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {getTodayDate()}
              </p>
              <p className={`text-sm font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {getCurrentTime()}
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Built with React & TypeScript
                </p>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;