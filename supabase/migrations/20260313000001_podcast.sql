CREATE TABLE IF NOT EXISTS podcast_pitches (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  show_title   TEXT        NOT NULL,
  concept      TEXT        NOT NULL,
  sample_link  TEXT,
  email        TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE podcast_pitches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_pitch"
  ON podcast_pitches
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "auth_read_pitches"
  ON podcast_pitches
  FOR SELECT
  USING (auth.role() = 'authenticated');
