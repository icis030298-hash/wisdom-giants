-- Create giants table
CREATE TABLE giants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('achievement', 'recovery', 'wisdom', 'creativity')),
  slug TEXT UNIQUE NOT NULL,
  headline TEXT NOT NULL,
  quote TEXT NOT NULL,
  pain TEXT NOT NULL,
  recovery TEXT NOT NULL,
  lessons JSONB NOT NULL,
  persona TEXT NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentoring_history table
CREATE TABLE mentoring_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giant_id UUID REFERENCES giants(id),
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX idx_giants_slug ON giants(slug);

-- Enable RLS
ALTER TABLE giants ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentoring_history ENABLE ROW LEVEL SECURITY;

-- Create policies (Public read for giants, insert for mentoring)
CREATE POLICY "Public Read Giants" ON giants FOR SELECT USING (true);
CREATE POLICY "Public Insert Mentoring" ON mentoring_history FOR INSERT WITH CHECK (true);
