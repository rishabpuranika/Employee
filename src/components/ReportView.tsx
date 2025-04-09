import React from 'react';
import { BarChart, Clock, Download } from 'lucide-react';
import type { WorkEntry, Report } from '../types';

interface ReportViewProps {
  entries: WorkEntry[];
  period: Report['period'];
  onPeriodChange: (period: Report['period']) => void;
}

export function ReportView({ entries, period, onPeriodChange }: ReportViewProps) {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const entriesByCategory = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = [];
    }
    acc[entry.category].push(entry);
    return acc;
  }, {} as Record<string, WorkEntry[]>);

  const downloadReport = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Hours', 'Category', 'Status'];
    const rows = entries.map(entry => [
      new Date(entry.date).toLocaleDateString(),
      entry.description,
      entry.hours.toString(),
      entry.category,
      entry.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create summary section
    const summary = [
      '\n\nSummary',
      `Report Period: ${period}`,
      `Total Hours: ${totalHours}`,
      '\nBreakdown by Category:'
    ];

    Object.entries(entriesByCategory).forEach(([category, categoryEntries]) => {
      const categoryHours = categoryEntries.reduce((sum, entry) => sum + entry.hours, 0);
      summary.push(`${category}: ${categoryHours} hours`);
    });

    const fullReport = csvContent + summary.join('\n');

    // Create and download the file
    const blob = new Blob([fullReport], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `work-report-${period}-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Work Report
        </h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => onPeriodChange(e.target.value as Report['period'])}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">15 Days</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <button
            onClick={downloadReport}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md flex items-center">
        <Clock className="w-5 h-5 text-blue-500 mr-2" />
        <div>
          <p className="text-sm font-medium text-blue-900">Total Hours</p>
          <p className="text-2xl font-bold text-blue-700">{totalHours}</p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(entriesByCategory).map(([category, categoryEntries]) => (
          <div key={category} className="border rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-700 capitalize mb-2">{category}</h4>
            <div className="space-y-2">
              {categoryEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-900">{entry.description}</p>
                    <p className="text-gray-500 text-xs">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.status === 'completed' ? 'bg-green-100 text-green-800' :
                      entry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {entry.status}
                    </span>
                    <span className="font-medium text-gray-900">{entry.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}