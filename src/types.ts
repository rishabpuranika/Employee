export interface WorkEntry {
  id: string;
  date: string;
  description: string;
  hours: number;
  category: string;
  status: 'completed' | 'in-progress' | 'blocked';
}

export interface Report {
  totalHours: number;
  entriesByCategory: Record<string, WorkEntry[]>;
  period: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
}