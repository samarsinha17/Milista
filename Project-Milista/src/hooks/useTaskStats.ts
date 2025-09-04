import { useMemo } from 'react';
import { Task, TaskStats } from '../types/Task';

export function useTaskStats(tasks: Task[]): TaskStats {
  return useMemo(() => {
    const today = new Date().toDateString();
    
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      overdue: tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate) < new Date()
      ).length,
      dueToday: tasks.filter(task => 
        !task.completed && 
        task.dueDate && 
        new Date(task.dueDate).toDateString() === today
      ).length,
    };
  }, [tasks]);
}