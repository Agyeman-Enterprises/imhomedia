-- IMHO Media: Initial schema
-- Track submissions from artists

CREATE TABLE IF NOT EXISTS track_submissions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_name   TEXT        NOT NULL,
  track_title   TEXT        NOT NULL,
  genre         TEXT        NOT NULL,
  track_link    TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  status        TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE track_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public submission form)
CREATE POLICY "public_submit"
  ON track_submissions
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "auth_read"
  ON track_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only authenticated users can update (approve / reject)
CREATE POLICY "auth_update"
  ON track_submissions
  FOR UPDATE
  USING (auth.role() = 'authenticated');
