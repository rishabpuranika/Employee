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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="lesson_no" value={formData.lesson_no} onChange={handleChange} placeholder="Lesson No." required />
      <input name="proposed_date" value={formData.proposed_date} onChange={handleChange} placeholder="Proposed Date" required />
      <input name="proposed_time" value={formData.proposed_time} onChange={handleChange} placeholder="Proposed Time" required />
      <textarea name="reasons" value={formData.reasons} onChange={handleChange} placeholder="If not taken, Reasons" />
      <input name="actual_date" value={formData.actual_date} onChange={handleChange} placeholder="Actual Date" />
      <input name="actual_time" value={formData.actual_time} onChange={handleChange} placeholder="Actual Time" />
      <textarea name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Remarks" />
      <button type="submit">Add Entry</button>
    </form>
  );
};