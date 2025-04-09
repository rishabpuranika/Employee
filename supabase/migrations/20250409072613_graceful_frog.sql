/*
  # Fix profiles table policies

  1. Changes
    - Drop and recreate the admin policy to avoid recursion
    - Keep existing user policy intact

  2. Security
    - Maintain RLS on profiles table
    - Simplify admin policy to avoid recursion
*/

-- Drop the problematic policy that's causing recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- Create new, simplified admin policy
CREATE POLICY "Admins can manage all profiles"
ON profiles
FOR ALL
TO authenticated
USING (
  role = 'admin'
);