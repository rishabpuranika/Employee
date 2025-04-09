/*
  # Fix profiles table policies

  1. Changes
    - Remove recursive policy that was causing infinite recursion
    - Add simplified policies for profile access

  2. Security
    - Enable RLS on profiles table (already enabled)
    - Add policy for admins to manage all profiles
    - Add policy for users to read their own profile
*/

-- Drop the problematic policy that's causing recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create new, simplified policies
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  role = 'admin'
);

CREATE POLICY "Users can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);