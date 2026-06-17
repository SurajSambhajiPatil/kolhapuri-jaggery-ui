-- ================================================================
-- GUDORA FOODS — Subscriptions / Newsletter Table
-- ================================================================
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Requires admin_setup.sql to have been run first (uses is_admin())
-- ================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT,
  mobile        TEXT,
  full_name     TEXT,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  source        TEXT        NOT NULL DEFAULT 'popup',  -- 'popup' | 'footer' | 'checkout'
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT
);

CREATE INDEX IF NOT EXISTS idx_sub_email   ON subscriptions (email)   WHERE email   IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sub_user_id ON subscriptions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sub_active  ON subscriptions (is_active, subscribed_at DESC);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone (guest or logged-in) can subscribe
DROP POLICY IF EXISTS "sub_insert" ON subscriptions;
CREATE POLICY "sub_insert" ON subscriptions
  FOR INSERT WITH CHECK (true);

-- Users can read their own subscription
DROP POLICY IF EXISTS "sub_select_own" ON subscriptions;
CREATE POLICY "sub_select_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Admin can read ALL subscriptions
DROP POLICY IF EXISTS "sub_select_admin" ON subscriptions;
CREATE POLICY "sub_select_admin" ON subscriptions
  FOR SELECT USING (is_admin());

-- Admin can toggle is_active / add notes
DROP POLICY IF EXISTS "sub_update_admin" ON subscriptions;
CREATE POLICY "sub_update_admin" ON subscriptions
  FOR UPDATE USING (is_admin());

-- Admin can delete a subscription row
DROP POLICY IF EXISTS "sub_delete_admin" ON subscriptions;
CREATE POLICY "sub_delete_admin" ON subscriptions
  FOR DELETE USING (is_admin());
