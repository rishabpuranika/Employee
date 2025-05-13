import React, { useState } from 'react';
import type { WorkEntry } from '../types';

export const WorkEntryForm = ({ onSubmit }: { onSubmit: (entry: Omit<WorkEntry, 'id' | 'user_id' | 'created_at'>) => void }) => {
  const [formData, setFormData] = useState({
    lesson_no: '',
    proposed_date: '',
    proposed_time: '',
    reasons: '',
    actual_date: '',
    actual_time: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use proposed_date as the date field for filtering
      await onSubmit({
        ...formData,
        date: formData.proposed_date, // Add the date field for filtering
        lesson_no: Number(formData.lesson_no),
      });

      setFormData({
        lesson_no: '',
        proposed_date: '',
        proposed_time: '',
        reasons: '',
        actual_date: '',
        actual_time: '',
        remarks: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="lesson_no" className="block text-sm font-medium text-gray-700">
            Lesson Number
          </label>
          <input
            id="lesson_no"
            name="lesson_no"
            type="number"
            value={formData.lesson_no}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter lesson number"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="proposed_date" className="block text-sm font-medium text-gray-700">
            Proposed Date
          </label>
          <input
            id="proposed_date"
            name="proposed_date"
            type="date"
            value={formData.proposed_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="proposed_time" className="block text-sm font-medium text-gray-700">
            Proposed Time
          </label>
          <input
            id="proposed_time"
            name="proposed_time"
            type="time"
            value={formData.proposed_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="actual_date" className="block text-sm font-medium text-gray-700">
            Actual Date
          </label>
          <input
            id="actual_date"
            name="actual_date"
            type="date"
            value={formData.actual_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="actual_time" className="block text-sm font-medium text-gray-700">
            Actual Time
          </label>
          <input
            id="actual_time"
            name="actual_time"
            type="time"
            value={formData.actual_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="reasons" className="block text-sm font-medium text-gray-700">
          Reasons (if not taken)
        </label>
        <textarea
          id="reasons"
          name="reasons"
          value={formData.reasons}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter reasons if the lesson was not taken"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
          Remarks
        </label>
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter any additional remarks"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Entry...
            </span>
          ) : (
            'Add Entry'
          )}
        </button>
      </div>
    </form>
  );
};