-- Add is_standalone column to quizzes table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='quizzes' AND column_name='is_standalone') THEN
        ALTER TABLE public.quizzes ADD COLUMN is_standalone BOOLEAN DEFAULT false;
    END IF;
END $$;
