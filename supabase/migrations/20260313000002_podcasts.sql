CREATE TABLE IF NOT EXISTS podcast_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  show_slug TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE podcast_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_subscribe" ON podcast_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_subs" ON podcast_subscribers FOR SELECT USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS episode_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_slug TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  timestamp_seconds INTEGER NOT NULL,
  reaction TEXT NOT NULL CHECK (reaction IN ('fire','heart','mind_blown','insight','disagree')),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE episode_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_react" ON episode_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "public_read_reactions" ON episode_reactions FOR SELECT USING (true);
