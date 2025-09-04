export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
}