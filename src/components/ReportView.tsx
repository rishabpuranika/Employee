import React from 'react';
import type { WorkEntry } from '../types';

export const ReportView = ({ entries }: { entries: WorkEntry[] }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Lesson No.</th>
          <th className="border border-gray-300 px-4 py-2">Proposed Date</th>
          <th className="border border-gray-300 px-4 py-2">Proposed Time</th>
          <th className="border border-gray-300 px-4 py-2">If not taken, Reasons</th>
          <th className="border border-gray-300 px-4 py-2">Actual Date</th>
          <th className="border border-gray-300 px-4 py-2">Actual Time</th>
          <th className="border border-gray-300 px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.id}>
            <td className="border border-gray-300 px-4 py-2">{entry.lesson_no}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.proposed_date}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.proposed_time}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.reasons}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.actual_date}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.actual_time}</td>
            <td className="border border-gray-300 px-4 py-2">{entry.remarks}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};