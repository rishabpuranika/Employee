export type WorkEntry = {
  id: string;
  user_id: string;
  created_at: string;
  date: string; // Added date field to match filtering in App.tsx
  lesson_no: number;
  proposed_date: string;
  proposed_time: string;
  reasons: string | null;
  actual_date: string | null;
  actual_time: string | null;
  remarks: string | null;
};

export interface Report {
  totalHours: number;
  entriesByCategory: Record<string, WorkEntry[]>;
  period: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
}