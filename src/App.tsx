import React, { useState, useEffect } from 'react';
import { WorkEntryForm } from './components/WorkEntryForm';
import { ReportView } from './components/ReportView';
import { AuthForm } from './components/AuthForm';
import type { WorkEntry, Report } from './types';
import { ClipboardList, LogOut, Download } from 'lucide-react';
import { supabase } from './lib/supabase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Session } from '@supabase/supabase-js';

// Add type declaration for jsPDF.autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

function App() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [reportPeriod, setReportPeriod] = useState<Report['period']>('daily');
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For development, comment out signOut to prevent automatic logout
    // supabase.auth.signOut();

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      if (session?.user) {
        console.log('User ID from session:', session.user.id);
        checkUserRole(session.user.id);
        loadEntries(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      if (session?.user) {
        console.log('User ID from auth change:', session.user.id);
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

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (data) {
        console.log('Entries loaded:', data);
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
      console.log('Checking role for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking user role:', error);
        throw error;
      }

      console.log('Profile data:', data);
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setEntries([]);
      setIsAdmin(false);
      // Force reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddEntry = async (newEntry: Omit<WorkEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!session?.user?.id) {
      alert('You must be logged in to add an entry.');
      return;
    }

    try {
      console.log('Current session:', session);
      console.log('User ID for entry:', session.user.id);
      console.log('Submitting entry:', newEntry);

      // First verify the profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        console.error('Profile error details:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint
        });
        throw new Error(`Failed to verify user profile: ${profileError.message}`);
      }

      // If no profile exists, try to create one
      if (!profile) {
        console.log('No profile found, creating new profile for user:', session.user.id);

        // First try to create profile with regular client
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{
            id: session.user.id,
            role: 'user',
            created_at: new Date().toISOString()
          }]);

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);

          // If regular client fails, try to create profile through auth.users trigger
          const { error: authError } = await supabase.auth.updateUser({
            data: { role: 'user' }
          });

          if (authError) {
            console.error('Error updating user metadata:', authError);
            throw new Error('Failed to create user profile. Please contact support.');
          }
        }
        console.log('Profile created successfully');
      } else {
        console.log('Existing profile found:', profile);
      }

      // Transform the entry to match the database schema
      const transformedEntry = {
        user_id: session.user.id,
        date: newEntry.proposed_date,
        lesson_no: newEntry.lesson_no,
        proposed_date: newEntry.proposed_date,
        proposed_time: newEntry.proposed_time,
        reasons: newEntry.reasons || null,
        actual_date: newEntry.actual_date || null,
        actual_time: newEntry.actual_time || null,
        remarks: newEntry.remarks || null
      };

      console.log('Transformed entry:', transformedEntry);

      const { data, error } = await supabase
        .from('work_entries')
        .insert([transformedEntry])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        console.error('Insert error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        alert(`Failed to add entry: ${error.message}`);
        return;
      }

      if (data) {
        console.log('Entry added successfully:', data);
        setEntries(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred while adding the entry. Please try again.');
      }
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Employee Work Tracker Report', 14, 10);
    doc.autoTable({
      head: [['Lesson No.', 'Proposed Date', 'Proposed Time', 'Reasons', 'Actual Date', 'Actual Time', 'Remarks']],
      body: entries.map(entry => [
        entry.lesson_no,
        entry.proposed_date,
        entry.proposed_time,
        entry.reasons || 'N/A',
        entry.actual_date || 'N/A',
        entry.actual_time || 'N/A',
        entry.remarks || 'N/A',
      ]),
    });
    doc.save('work_tracker_report.pdf');
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    console.log('Filtering entry:', entry.date, 'Days diff:', daysDiff, 'Period:', reportPeriod);

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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <Download className="w-5 h-5 mr-1" />
                Download PDF
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Sign Out
              </button>
            </div>
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