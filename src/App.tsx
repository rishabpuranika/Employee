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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkUserRole(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkUserRole(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string | undefined) => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setIsAdmin(data.role === 'admin');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddEntry = (newEntry: Omit<WorkEntry, 'id'>) => {
    const entry: WorkEntry = {
      ...newEntry,
      id: crypto.randomUUID(),
    };
    setEntries(prev => [...prev, entry]);
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
    return <AuthForm onAuthSuccess={() => {}} />;
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
      </main>
    </div>
  );
}

export default App;