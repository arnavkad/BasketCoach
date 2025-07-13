-- Create the user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unique index on user_id to ensure one stats entry per user
CREATE UNIQUE INDEX IF NOT EXISTS user_stats_user_id_idx ON user_stats (user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own stats
CREATE POLICY "Users can view their own stats." ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own stats
CREATE POLICY "Users can insert their own stats." ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own stats
CREATE POLICY "Users can update their own stats." ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);
