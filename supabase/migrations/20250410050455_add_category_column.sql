/*
  # Add category column to work_entries table

  1. Changes
    - Add category column to work_entries table
    - Set default value to 'lesson'
*/

ALTER TABLE work_entries
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'lesson'; 