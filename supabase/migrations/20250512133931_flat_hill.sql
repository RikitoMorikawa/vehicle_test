/*
  # Add created_at and status columns to loan_applications table

  1. New Columns
    - `created_at` (作成日時)
    - `status` (審査状況)
*/

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loan_applications' 
    AND column_name = 'created_at'
  ) THEN
    ALTER TABLE loan_applications 
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Add status column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loan_applications' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE loan_applications 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';
  END IF;
END $$;

-- Create index on status column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'loan_applications' 
    AND indexname = 'idx_loan_applications_status'
  ) THEN
    CREATE INDEX idx_loan_applications_status ON loan_applications(status);
  END IF;
END $$;


/*
  # Change loan application status to numeric type

  1. Changes
    - Alter status column from TEXT to INTEGER
    - Update existing values to numeric equivalents
    - Add check constraint for valid status values
    
  Status values:
    0: pending (審査待ち)
    1: reviewing (審査中)
    2: approved (承認)
    3: rejected (否認)
*/

-- First convert existing text values to numbers
UPDATE loan_applications
SET status = CASE status
  WHEN 'pending' THEN '0'
  WHEN 'reviewing' THEN '1'
  WHEN 'approved' THEN '2'
  WHEN 'rejected' THEN '3'
  ELSE '0'
END;

-- Change column type to integer
ALTER TABLE loan_applications
ALTER COLUMN status TYPE INTEGER USING status::integer;

-- Add check constraint for valid status values
ALTER TABLE loan_applications
ADD CONSTRAINT loan_applications_status_check
CHECK (status >= 0 AND status <= 3);

-- Add comment explaining status values
COMMENT ON COLUMN loan_applications.status IS 'Loan application status: 0=pending, 1=reviewing, 2=approved, 3=rejected';