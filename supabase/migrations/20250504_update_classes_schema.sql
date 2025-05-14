-- Update classes table to add start_date and remove end_time
ALTER TABLE classes
ADD COLUMN IF NOT EXISTS start_date DATE;

-- Ensure start_time is properly stored as a timestamp
ALTER TABLE classes
ALTER COLUMN start_time TYPE TIMESTAMP WITH TIME ZONE;

-- Copy existing data from end_time to start_date if needed
-- This is a placeholder - in a real migration you might want to handle data conversion

-- Remove end_time column
ALTER TABLE classes
DROP COLUMN IF EXISTS end_time;
