import React, { useState, useEffect } from 'react';
import { WorkEntryForm } from './components/WorkEntryForm';
import { ReportView } from './components/ReportView';
import { AuthForm } from './components/AuthForm';
import type { WorkEntry, Report } from './types';
import { ClipboardList, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';

function App() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [reportPeriod, setReportPeriod] = useState<Report['period']>('daily');
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any existing session on mount
    supabase.auth.signOut();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkUserRole(session.user.id);
        loadEntries(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkUserRole(session.user.id);
        loadEntries(session.user.id);
      } else {
        setEntries([]);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadEntries = async (userId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('work_entries')
        .select('*')
        .order('date', { ascending: false });

      if (!isAdmin) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setEntries(data);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEntries([]);
    setIsAdmin(false);
  };

  const handleAddEntry = async (newEntry: Omit<WorkEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('work_entries')
        .insert([
          {
            ...newEntry,
            user_id: session.user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding entry:', error);
        alert('Failed to add entry. Please try again.');
        return;
      }

      if (data) {
        setEntries(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      alert('Failed to add entry. Please try again.');
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (reportPeriod) {
      case 'daily':
        return entryDate.toDateString() === now.toDateString();
      case 'weekly':
        return daysDiff <= 7;
      case 'biweekly':
        return daysDiff <= 15;
      case 'monthly':
        return entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear();
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        const entryQuarter = Math.floor(entryDate.getMonth() / 3);
        return entryQuarter === quarter &&
          entryDate.getFullYear() === now.getFullYear();
      case 'yearly':
        return entryDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  if (!session) {
    return <AuthForm onAuthSuccess={() => { }} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClipboardList className="w-6 h-6 mr-2" />
              Employee Work Tracker
              {isAdmin && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
            </h1>
            <button
              onClick={handleSignOut}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <WorkEntryForm onSubmit={handleAddEntry} />
            </div>
            <div>
              <ReportView
                entries={filteredEntries}
                period={reportPeriod}
                onPeriodChange={setReportPeriod}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;