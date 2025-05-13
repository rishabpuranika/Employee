import React from 'react';
import type { WorkEntry, Report } from '../types';

interface ReportViewProps {
  entries: WorkEntry[];
  period: Report['period'];
  onPeriodChange: (period: Report['period']) => void;
}

export const ReportView = ({ entries, period, onPeriodChange }: ReportViewProps) => {
  const periods: Report['period'][] = ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Report Period</h3>
        <div className="flex space-x-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reasons</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.lesson_no}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.proposed_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.proposed_time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.reasons || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.actual_date || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.actual_time || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.remarks || 'N/A'}</td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No entries found for the selected period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};