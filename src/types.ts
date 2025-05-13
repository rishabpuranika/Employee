export type WorkEntry = {
  id: string;
  user_id: string;
  created_at: string;
  lesson_no: number;
  proposed_date: string;
  proposed_time: string;
  reasons: string;
  actual_date: string;
  actual_time: string;
  remarks: string;
};

export interface Report {
  totalHours: number;
  entriesByCategory: Record<string, WorkEntry[]>;
  period: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
}