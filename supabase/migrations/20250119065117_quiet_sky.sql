/*
  # Add notes to messages

  1. Changes
    - Add `note` column to `messages` table for admin notes
    
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'note'
  ) THEN
    ALTER TABLE messages ADD COLUMN note text DEFAULT '';
  END IF;
END $$;