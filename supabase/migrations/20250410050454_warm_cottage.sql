/*
  # Create work entries table

  1. New Tables
    - `work_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `date` (date)
      - `description` (text)
      - `hours` (numeric)
      - `category` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on work_entries table
    - Add policies for users to manage their own entries
    - Add policy for admins to view all entries
*/

CREATE TABLE IF NOT EXISTS work_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  hours numeric(5,2) NOT NULL CHECK (hours > 0),
  category text NOT NULL,
  status text NOT NULL CHECK (status IN ('completed', 'in-progress', 'blocked')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE work_entries ENABLE ROW LEVEL SECURITY;

-- Users can manage their own entries
CREATE POLICY "Users can manage own entries"
ON work_entries
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all entries
CREATE POLICY "Admins can view all entries"
ON work_entries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);